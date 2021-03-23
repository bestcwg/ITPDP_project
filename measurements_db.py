"""Handles the database for the MEASUREMENTS web site"""
import sqlite3

__MEASUREMENTS_DB = "db/measurements.db"
__CREATE_SQL = """
CREATE TABLE IF NOT EXISTS measurements
(topic TEXT NOT NULL,
 id INTEGER NOT NULL,
 date TIMESTAMP NOT NULL);
"""


def create_database():
    """Creates the database"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(__CREATE_SQL)
        conn.commit()


def store_measurement(topic: str, id: int) -> int:
    """Stores a measurement in the DB

    Args:
        topic (str): the topic of the measurement
        id (int): the id of the measurement

    Returns:
        int: the number of rows affected (should be 1)
    """
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO MEASUREMENTS VALUES (?,?,DATETIME('now'))", (topic, id)
        )
        conn.commit()
        return cur.rowcount


if __name__ != "__main__":
    create_database()