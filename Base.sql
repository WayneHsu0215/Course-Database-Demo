
USE master
-- 檢查資料庫是否存在
IF DB_ID ( 'BANK' ) IS NOT NULL
    DROP DATABASE BANK;
GO
-- 新建資料庫
CREATE DATABASE BANK
    COLLATE Chinese_PRC_CI_AS;
GO



-- 新建資料表
USE BANK;

-- 新增用戶資料Table: Customer
CREATE TABLE Customer
(
    ID int,
    PWD varbinary(max),
    LName varchar(20),
    FName varchar(20),
    BDate date,
    Sex char(1),
    Address varchar(50),
    City varchar(20),
    Country varchar(50),
    UP_Date datetime,
    UP_User varchar(20)
        PRIMARY KEY (ID)
)
GO

DECLARE @CURRENT_TS datetimeoffset = GETDATE()
INSERT INTO Customer
(ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('0', HASHBYTES('SHA2_512',N'123'),'CY', 'Lien', '19120101', 'M', 'Neihu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD,Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('001', HASHBYTES('SHA2_512',N'123'),'LJ', 'KUO', '19981002', 'F', 'Neihu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('002', HASHBYTES('SHA2_512',N'123'), 'CW', 'Lin', '19981002', 'F', 'Tianmu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('003', HASHBYTES('SHA2_512',N'123'), 'DW', 'Wang', '19981002', 'M', 'Beitou', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
GO

CREATE TABLE Account
(
    ID int PRIMARY KEY,
    AccID varchar(10) UNIQUE,
    Password varchar(100),
    Balance int,
    BranchID int,
    AccType varchar(3),
    UP_Date datetime,
    UP_User varchar(20)
);
-- 插入测试数据（只有帐号 "admin" 的记录）
DECLARE @CURRENT_TS datetimeoffset = GETDATE();
INSERT INTO ACCOUNT
(ID, AccID, Password, Balance, BranchID, AccType, UP_Date, UP_User)
VALUES
    (1, 'admin', 'admin', 5000, 10, 'B01', @CURRENT_TS, '0');
GO

select * from Account



-- 新增交易紀錄Table: Trans
CREATE TABLE Trans
(
    AccID varchar(10),
    TranID int IDENTITY(1,1) PRIMARY KEY,
    TranTime datetime DEFAULT GETDATE(),
    AtmID varchar(3),
    TranType varchar(3),
    TranNote varchar(100),
    UP_DATETIME datetime DEFAULT GETDATE(),
    UP_USR varchar(20)
)
GO

INSERT INTO Trans (AccID, AtmID, TranType, TranNote, UP_USR)
VALUES
    ('1234567890',  '001', 'DEP', '測試', 'User1'),
    ('1234567891',  '002', 'WDR', 'Withdraw Money', 'User2'),
    ('1234567892',  '003', 'DEP', 'Deposit Money', 'User3'),
    ('1234567893',  '001', 'WDR', 'Withdraw Money', 'User4'),
    ('1234567894',  '002', 'DEP', 'Deposit Money', 'User5'),
    ('1234567895',  '003', 'WDR', 'Withdraw Money', 'User6'),
    ('1234567896',  '001', 'DEP', 'Deposit Money', 'User7'),
    ('1234567897',  '002', 'WDR', 'Withdraw Money', 'User8'),
    ('1234567898',  '003', 'DEP', 'Deposit Money', 'User9'),
    ('1234567899',  '001', 'WDR', 'Withdraw Money', 'User10');
GO

-- Create Table LOG_SEQ
CREATE TABLE LOG_SEQ(
                        SDATE varchar(8) NOT NULL PRIMARY KEY, -- 當天的log紀錄
                        LOG_COUNT varchar(6) NOT NULL --當天一共有多少筆log
)
GO

SELECT * FROM LOG_SEQ
SELECT * FROM Customer
SELECT * FROM Account
SELECT * FROM Trans

SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR
FROM Trans;

CREATE TABLE Courses (
                         ID NVARCHAR(50),
                         Semester NVARCHAR(50),
                         MainInstructorName NVARCHAR(100),
                         SubjectCode NVARCHAR(50),
                         DepartmentCode NVARCHAR(50),
                         CoreCode NVARCHAR(50),
                         SubjectGroup NVARCHAR(50),
                         Grade  NVARCHAR(50),
                         ClassGroup NVARCHAR(50),
                         SubjectNameChinese NVARCHAR(500),
                         SubjectNameEnglish NVARCHAR(500),
                         InstructorName NVARCHAR(100),
                         NumberOfStudents  NVARCHAR(50),
                         NumberOfMaleStudents  NVARCHAR(50),
                         NumberOfFemaleStudents  NVARCHAR(50),
                         Credits  NVARCHAR(50),
                         WeeksOfClasses  NVARCHAR(50),
                         HoursPerWeek  NVARCHAR(50),
                         CourseTypeCode NVARCHAR(50),
                         CourseTypeName NVARCHAR(100),
                         Location NVARCHAR(100),
                         Weekday NVARCHAR(50),
                         ClassPeriods NVARCHAR(100),
                         TimetableNotes NVARCHAR(2000),
                         CourseSummaryChinese NVARCHAR(1000),
                         CourseSummaryEnglish NVARCHAR(2000)
);
GO

select * from Courses