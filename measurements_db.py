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
            "INSERT INTO MEASUREMENTS VALUES (?,?,?,DATETIME('now'))", (temp, hum, press)
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

def get_latest():
    """Returns latest measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        """SELECT temp, hum, press, date FROM measurements WHERE date = (SELECT MAX(date) FROM measurements)""")
        return cur.fetchall()

def get_maxtemp():
    """Returns max temp measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT temp, date FROM measurements WHERE temp = (SELECT MAX(temp) FROM measurements) ORDER BY date DESC LIMIT 1")
        return cur.fetchall()

def get_mintemp():
    """Returns min temp measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT temp, date FROM measurements WHERE temp = (SELECT MIN(temp) FROM measurements) ORDER BY date DESC LIMIT 1")
        return cur.fetchall()

def get_maxhum():
    """Returns min hum measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT hum, date FROM measurements WHERE hum = (SELECT MAX(hum) FROM measurements ORDER BY date LIMIT 1)")
        return cur.fetchall()

def get_minhum():
    """Returns min hum measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT hum, date FROM measurements WHERE hum = (SELECT MIN(hum) FROM measurements ORDER BY date LIMIT 1)")
        return cur.fetchall()

def get_maxpress():
    """Returns max press measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT press, date FROM measurements WHERE press = (SELECT MAX(press) FROM measurements ORDER BY date LIMIT 1)")
        return cur.fetchall()

def get_minpress():
    """Returns min press measurement"""
    with sqlite3.connect(
        __MEASUREMENTS_DB) as conn:
        cur = conn.cursor()
        cur.execute(
        "SELECT press, date FROM measurements WHERE press = (SELECT MIN(press) FROM measurements ORDER BY date LIMIT 1)")
        return cur.fetchall()

def get_minmaxlatest():
    data = get_latest(), get_maxtemp(), get_mintemp(), get_maxhum(), get_minhum(), get_maxpress(), get_minpress()
    return data


if __name__ != "__main__":
    create_database()
