// db.js
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'chltc-sqlserver1.database.windows.net',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
};

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');

        const createSchedulesTableQuery = `
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tblNewsletterSchedules')
            BEGIN
                CREATE TABLE tblNewsletterSchedules (
                    ID INT IDENTITY(1,1) PRIMARY KEY,
                    dateTime DATETIME NOT NULL,
                    Subject NVARCHAR(255) NOT NULL,
                    EmailBody NVARCHAR(MAX) NOT NULL,
                    category NVARCHAR(100) NULL,
                    deliveryReport NVARCHAR(255) NULL,
                    members NVARCHAR(MAX) NULL, 
                    createdAt DATETIME DEFAULT GETDATE(),
                    updatedAt DATETIME DEFAULT GETDATE()
                );
                PRINT 'Table "tblNewsletterSchedules" has been created.';
            END
            ELSE
            BEGIN
                PRINT 'Table "tblNewsletterSchedules" already exists.';
            END
        `;
        await sql.query(createSchedulesTableQuery);

    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
    }
};

export { sql, connectToDatabase };
