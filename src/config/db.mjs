// db.js
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'localhost',
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
        const checkTableQuery = `
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'newsletter_templates')
            BEGIN
                CREATE TABLE newsletter_templates (
                    NewsletterID INT IDENTITY(1,1) PRIMARY KEY,
                    title NVARCHAR(255) NOT NULL,
                    content NVARCHAR(MAX) NOT NULL,
                    createdAt DATETIME DEFAULT GETDATE()
                );
                PRINT 'Table "newsletter_templates" has been created.';
            END
            ELSE
            BEGIN
                PRINT 'Table "newsletter_templates" already exists.';
            END
        `;
        await sql.query(checkTableQuery);

    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
    }
};

export { sql, connectToDatabase };
