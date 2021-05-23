"""Handles the database for the datablocks for the GUI"""
import sqlite3

__MEASUREMENTS_DB = "db/datablocks.db"
__CREATE_SQL = """
CREATE TABLE IF NOT EXISTS datablocks(
    rfid TEXT NOT NULL,
    primary_key TEXT NOT NULL
 );
"""

def create_database():
    """Creates the database"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(__CREATE_SQL)
        print(__CREATE_SQL)
        conn.commit()

def store_table(temp_table):
    """Stores the temp table to the database"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS t1{};""".format(tuple(temp_table)))
        conn.commit()

def reset_database():
    """Deletes all stored tables in database"""
    with sqlite3.connect(
        __MEASUREMENTS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute("""
        SELECT * FROM sqlite_master WHERE type = 'table';
        """)
        h = cur.fetchall()
        print(h)

if __name__ != "__main__":
    create_database()
    reset_database()