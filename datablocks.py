"""Handles the database for the datablocks for the GUI"""
import sqlite3

__DATABLOCKS_DB = "db/datablocks.db"
__DATABLOCKS_TABLE = """CREATE TABLE IF NOT EXISTS datablocks 
                                        (A TEXT,
                                        B TEXT,
                                        C TEXT,
                                        D TEXT,
                                        E TEXT,
                                        F TEXT)
                                        """

def store_tabletest(temp_table):
    """Stores the temp table to the database"""
    with sqlite3.connect(
        __DATABLOCKS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        print("Store Table:")
        print(temp_table)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS t1{};""".format(tuple(temp_table)))
        conn.commit()

def create_database():
    with sqlite3.connect(
        __DATABLOCKS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute(__DATABLOCKS_TABLE)
        conn.commit()

def store_table(temp_table):
    print(temp_table)
    data = {"A":"", "B":"", "C":"", "D":"", "E":"", "F":""}
    for x in temp_table:
        if x in data :
            data[x] = temp_table[x]

    finaldata = []
    for x in data:
        finaldata.append(data[x])

    with sqlite3.connect(
        __DATABLOCKS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute("""
        INSERT INTO datablocks VALUES(?,?,?,?,?,?)
        """, finaldata)
        conn.commit()

def reset_database():
    """Deletes all stored tables in database"""
    with sqlite3.connect(
        __DATABLOCKS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute("""
        DELETE FROM datablocks;
        """)
        conn.commit()

def take_all():
    with sqlite3.connect(
        __DATABLOCKS_DB, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    ) as conn:
        cur = conn.cursor()
        cur.execute("""
        SELECT * FROM datablocks;
        """)
        return print(cur.fetchall())

if __name__ != "__main__":
    create_database()