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
    """Stores a measurement in the DB"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO MEASUREMENTS VALUES (?,?,DATETIME('now'))", (topic, id)
        )
        conn.commit()
        return cur.rowcount

def get_measurements():
    """Returns all measurements"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
        ) as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM measurements ORDER BY date DESC")
        return cur.fetchall()

def get_minmaxlatest():
    """Returns max,min and latest measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
        ) as conn:
        cur = conn.cursor()
        cur.execute(
        """SELECT id, date FROM measurements WHERE date = (SELECT MAX(date) FROM measurements)
        UNION ALL
        SELECT id, date FROM measurements WHERE id = (SELECT MAX(id) FROM measurements)
        UNION ALL
        SELECT id, date FROM measurements WHERE id = (SELECT MIN(id) FROM measurements)
        """
        )
    return cur.fetchall()

if __name__ != "__main__":
    create_database()
