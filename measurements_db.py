"""Handles the database for the MEASUREMENTS web site"""
import sqlite3

__MEASUREMENTS_DB = "db/measurements.db"
__CREATE_SQL = """
CREATE TABLE IF NOT EXISTS measurements(
    temp FLOAT(2) NOT NULL,
    hum FLOAT(2) NOT NULL,
    press FLOAT(2) NOT NULL,
    date TIMESTAMP NOT NULL
 );
"""


def create_database():
    """Creates the database"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(__CREATE_SQL)
        conn.commit()


def store_measurement(temp: float, hum: float, press: float) -> float:
    """Stores a measurement in the DB"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO MEASUREMENTS VALUES (?,?,?,DATETIME('now','localtime'))"
            , (temp, hum, press)
        )
        conn.commit()
        return cur.rowcount


def get_maxpress():
    """Returns max press measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        """SELECT press, date FROM measurements
        WHERE press = (SELECT MAX(press) FROM measurements
        ORDER BY date LIMIT 1)""")
        return cur.fetchall()


if __name__ != "__main__":
    create_database()
