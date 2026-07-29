"""update_embedding_dim_to_3072

Revision ID: f8523323637f
Revises: 5ce22cfe0671
Create Date: 2026-07-17 12:58:41.423691

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8523323637f'
down_revision: Union[str, Sequence[str], None] = '5ce22cfe0671'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE tbl_search_index ALTER COLUMN embedding TYPE vector(3072)")
    op.execute("ALTER TABLE tbl_transcript_segment ALTER COLUMN embedding TYPE vector(3072)")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TABLE tbl_transcript_segment ALTER COLUMN embedding TYPE vector(768)")
    op.execute("ALTER TABLE tbl_search_index ALTER COLUMN embedding TYPE vector(768)")
