import psycopg2
from psycopg2 import pool
import config
from urllib.parse import urlparse
from custom_exceptions import DBConnectionException

class Connector:

    __pool = None

    # Singleton
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Connector, cls).__new__(cls)
        return cls.instance


    def commit(self, conn):
        conn.commit()


    def putConnection(self, conn):
        print('Кладем connection обратно в пулл')
        if conn:
            self.__pool.putconn(conn)


    def connect(self):

        if self.__pool is not None:
            print('Не создаем новый connect')
            return

        print('Создаем новый коннект')
        
        try:
            DATABASE_URL = 'postgres://okdvcueenwhtzi:6f3d4923d3e5bb2e5550505c81644773e9e86f4649abfd9e7abc7611748bfabc@ec2-54-155-87-214.eu-west-1.compute.amazonaws.com:5432/d84b7idkrs61sh'
            #DATABASE_URL = 'postgres://musa:345ferma@localhost/gmessengerdb'


            result = urlparse(DATABASE_URL)
            username = result.username
            password = result.password
            database = result.path[1:]
            hostname = result.hostname

            self.__pool = psycopg2.pool.ThreadedConnectionPool(minconn=1, maxconn=20, 
                                                                    user=username, 
                                                                    password=password,
                                                                    host=hostname, 
                                                                    database=database)

            if (self.__pool):
                print("Connection pool created successfully")



        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            raise DBConnectionException


    def getConnection(self):
        print('Берем connection из пулла')
        if self.__pool is None:
            raise DBConnectionException
        
        return self.__pool.getconn()

