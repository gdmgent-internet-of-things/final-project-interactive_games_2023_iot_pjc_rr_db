"""empty message

Revision ID: efe70fb02ddb
Revises: 6d95ae1e3813
Create Date: 2023-06-20 10:36:29.774454

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'efe70fb02ddb'
down_revision = '6d95ae1e3813'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('snake_game_score', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=50), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('snake_game_score', schema=None) as batch_op:
        batch_op.drop_column('name')

    # ### end Alembic commands ###