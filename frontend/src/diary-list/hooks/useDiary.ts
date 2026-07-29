import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMeetings, patchMeetingTitle } from "../api";
import { Meeting, SortOption } from "../types";

const DEFAULT_PAGE_SIZE = 4;

function normalize(value: string): string {
 return value.trim().toLowerCase();
}

function compareText(a: string, b: string): number {
 return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function sortMeetings(meetings: Meeting[], sortOption: SortOption): Meeting[] {
 const source = [...meetings];

 source.sort((left, right) => {
  switch (sortOption) {
   case "Most Recent":
    return (
     new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
   case "Oldest":
    return (
     new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
    );
   case "A → Z":
    return compareText(left.title, right.title);
   case "Z → A":
    return compareText(right.title, left.title);
   case "Duration":
    return (right.duration ?? -1) - (left.duration ?? -1);
   default:
    return 0;
  }
 });

 return source;
}

export interface UseDiaryOptions {
 pageSize?: number;
}

export function useDiary(options: UseDiaryOptions = {}) {
 const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;

 const [meetings, setMeetings] = useState<Meeting[]>([]);
 const [searchKeyword, setSearchKeyword] = useState("");
 const [sortOption, setSortOption] = useState<SortOption>("Most Recent");
 const [currentPage, setCurrentPage] = useState(1);

 const [isLoading, setIsLoading] = useState(true);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [errorMessage, setErrorMessage] = useState("");

 const loadMeetings = useCallback(
  async (refresh = false, signal?: AbortSignal) => {
   if (refresh) {
    setIsRefreshing(true);
   } else {
    setIsLoading(true);
   }
   setErrorMessage("");

   const startTime = Date.now();
   try {
    const data = await fetchMeetings(signal);
    if (signal?.aborted) return;

    // Ensure a smooth 600ms minimum duration so the loading skeleton is clearly visible to the user
    const elapsed = Date.now() - startTime;
    if (elapsed < 600) {
     await new Promise((resolve) => setTimeout(resolve, 600 - elapsed));
    }

    if (signal?.aborted) return;

    setMeetings(data);
    if (refresh) {
     setIsRefreshing(false);
    } else {
     setIsLoading(false);
    }
   } catch (error) {
    if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
     return; // Do not turn off isLoading on aborted request
    }
    setErrorMessage(
     error instanceof Error
      ? error.message
      : "Unable to retrieve diary data. Please try again later."
    );
    if (refresh) {
     setIsRefreshing(false);
    } else {
     setIsLoading(false);
    }
   }
  },
  []
 );

 useEffect(() => {
  const controller = new AbortController();
  void loadMeetings(false, controller.signal);
  return () => controller.abort();
 }, [loadMeetings]);

 const filteredMeetings = useMemo(() => {
  const keyword = normalize(searchKeyword);

  const filtered = keyword
   ? meetings.filter((meeting) => {
     const haystack = `${meeting.title} ${meeting.topic ?? ""}`.toLowerCase();
     return haystack.includes(keyword);
    })
   : meetings;

  return sortMeetings(filtered, sortOption);
 }, [meetings, searchKeyword, sortOption]);

 const totalItems = filteredMeetings.length;
 const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

 useEffect(() => {
  if (currentPage > totalPages) {
   setCurrentPage(totalPages);
  }
 }, [currentPage, totalPages]);

 const pagedMeetings = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  return filteredMeetings.slice(start, start + pageSize);
 }, [currentPage, filteredMeetings, pageSize]);

 const renameMeeting = useCallback(
  async (meetingId: string, nextTitle: string) => {
   const title = nextTitle.trim();
   let previousTitle = "";

   setMeetings((previous) =>
    previous.map((meeting) => {
     if (meeting.id !== meetingId) {
      return meeting;
     }
     previousTitle = meeting.title;
     return { ...meeting, title };
    })
   );

   try {
    await patchMeetingTitle(meetingId, title);
   } catch (error) {
    setMeetings((previous) =>
     previous.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, title: previousTitle } : meeting
     )
    );
    throw error;
   }
  },
  []
 );

 const refresh = useCallback(async () => {
  await loadMeetings(true);
 }, [loadMeetings]);

 return {
  meetings: pagedMeetings,
  allMeetings: meetings,
  isLoading,
  isRefreshing,
  errorMessage,
  searchKeyword,
  sortOption,
  currentPage,
  totalPages,
  totalItems,
  hasResult: totalItems > 0,
  setSearchKeyword: (value: string) => {
   setSearchKeyword(value);
   setCurrentPage(1);
  },
  setSortOption: (value: SortOption) => {
   setSortOption(value);
   setCurrentPage(1);
  },
  setCurrentPage,
  refresh,
  renameMeeting,
 };
}
