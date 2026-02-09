from sqlalchemy.engine import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env")

# Create engine with SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session