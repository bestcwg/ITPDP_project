"""Handles the database for the datablocks for the GUI"""
import sqlite3

__MEASUREMENTS_DB = "db/datablocks.db"

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
    reset_database()