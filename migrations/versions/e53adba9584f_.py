"""empty message

Revision ID: e53adba9584f
Revises: 682172d1ed66
Create Date: 2023-06-19 13:28:22.738380

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e53adba9584f'
down_revision = '682172d1ed66'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('username',
               existing_type=sa.TEXT(length=20),
               type_=sa.String(length=20),
               existing_nullable=False)
        batch_op.alter_column('password_hash',
               existing_type=sa.TEXT(length=128),
               type_=sa.String(length=128),
               existing_nullable=False,
               existing_server_default=sa.text("('')"))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('password_hash',
               existing_type=sa.String(length=128),
               type_=sa.TEXT(length=128),
               existing_nullable=False,
               existing_server_default=sa.text("('')"))
        batch_op.alter_column('username',
               existing_type=sa.String(length=20),
               type_=sa.TEXT(length=20),
               existing_nullable=False)

    # ### end Alembic commands ###
