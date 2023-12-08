/* eslint-disable no-unused-vars */
import { Router } from "express";
import sql from 'mssql';
const router = Router();
import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';

// 设置 multer 用于文件上传
const upload = multer({ dest: 'uploads/' });

const app = express();
router.get('/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const pool = req.app.locals.pool;

        // 查詢用於儲存明文密碼的字段
        const query = `SELECT AccID, Password FROM Account WHERE AccID = @username;`;

        const result = await pool.request()
            .input('username', username)
            .query(query);

        console.log("Query Result: ", result.recordset); // 印出查詢結果，方便除錯

        if (result.recordset.length > 0) {
            // 直接比較明文密碼
            if (password === result.recordset[0].Password) {
                req.session.user = { AccID: username };
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid Credentials' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/trans', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 執行查詢
        const result = await pool.request().query('SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR\n' +
            'FROM Trans;');

        // 在控制台中打印結果
        console.log(result);

        // 也可以將結果發送到客戶端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const pool = req.app.locals.pool;

        const file = xlsx.readFile(req.file.path);
        const sheetName = file.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(file.Sheets[sheetName], { header: 1, skipEmpty: true });

        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const request = pool.request();
            request.input('ID', sql.NVarChar, row[0]);
            request.input('Semester', sql.NVarChar, row[1]);
            request.input('MainInstructorName', sql.NVarChar, row[2]);
            request.input('SubjectCode', sql.NVarChar, row[3]);
            request.input('DepartmentCode', sql.NVarChar, row[4]);

            request.input('CoreCode', sql.NVarChar, row[5]);
            request.input('SubjectGroup', sql.NVarChar, row[6]);
            request.input('Grade', sql.NVarChar, row[7]);
            request.input('ClassGroup', sql.NVarChar, row[8]);

            request.input('SubjectNameChinese', sql.NVarChar, row[9]);
            request.input('SubjectNameEnglish', sql.NVarChar, row[10]);
            request.input('InstructorName', sql.NVarChar, row[11]);
            request.input('NumberOfStudents', sql.NVarChar, row[12]);
            request.input('NumberOfMaleStudents', sql.NVarChar, row[13]);
            request.input('NumberOfFemaleStudents', sql.NVarChar, row[14]);
            request.input('Credits', sql.NVarChar, row[15]);
            request.input('WeeksOfClasses', sql.NVarChar, row[16]);
            request.input('HoursPerWeek', sql.NVarChar, row[17]);
            request.input('CourseTypeCode', sql.NVarChar, row[18]);
            request.input('CourseTypeName', sql.NVarChar, row[19]);
            request.input('Location', sql.NVarChar, row[20]);

            request.input('Weekday', sql.NVarChar, row[21]);
            request.input('ClassPeriods', sql.NVarChar, row[22]);
            request.input('TimetableNotes', sql.NVarChar, row[23]);
            request.input('CourseSummaryChinese', sql.NVarChar, row[24]);
            request.input('CourseSummaryEnglish', sql.NVarChar, row[25]);
            const query = `
                INSERT INTO Courses (
                    ID, Semester, MainInstructorName, SubjectCode, DepartmentCode, CoreCode,
                    SubjectGroup, Grade, ClassGroup, SubjectNameChinese, SubjectNameEnglish,
                    InstructorName, NumberOfStudents, NumberOfMaleStudents, NumberOfFemaleStudents,
                    Credits, WeeksOfClasses, HoursPerWeek, CourseTypeCode, CourseTypeName,
                    Location, Weekday, ClassPeriods, TimetableNotes, CourseSummaryChinese, CourseSummaryEnglish
                ) VALUES (
                    @ID, @Semester, @MainInstructorName, @SubjectCode, @DepartmentCode, @CoreCode,
                    @SubjectGroup, @Grade, @ClassGroup, @SubjectNameChinese, @SubjectNameEnglish,
                    @InstructorName, @NumberOfStudents, @NumberOfMaleStudents, @NumberOfFemaleStudents,
                    @Credits, @WeeksOfClasses, @HoursPerWeek, @CourseTypeCode, @CourseTypeName,
                    @Location, @Weekday, @ClassPeriods, @TimetableNotes, @CourseSummaryChinese, @CourseSummaryEnglish
                )
            `;



            await request.query(query);
        }

        res.send('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});
router.get('/search', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 從查詢參數中獲取搜尋條件
        const { semester, subjectName, instructorName, department,departmentcode,
            grade,
            courseType,
            weekday,
            system,
            period,
            courseCategory,
            teacherCode,
            courseCode,
            className,
            classCode,

            numberOfStudents } = req.query;

        // 建立 SQL 查詢語句，包括模糊查詢的條件
        let query = 'SELECT * FROM Courses WHERE 1=1';

        if (department) {
            query += ` AND Department = '${department}'`;
        }
        if (semester) {
            query += ` AND Semester = '${semester}'`;
        }
        if (subjectName) {
            query += ` AND SubjectNameChinese LIKE '%${subjectName}%'`;
        }
        if (instructorName) {
            query += ` AND InstructorName LIKE '%${instructorName}%'`;
        }
        if (departmentcode) {
            query += ` AND DepartmentCode = '${departmentcode}'`;
        }
        if (grade) {
            query += ` AND Grade = '${grade}'`;
        }
        if (courseType) {
            query += ` AND CourseTypeCode = '${courseType}'`;
        }
        if (weekday) {
            query += ` AND Weekday = '${weekday}'`;
        }
        if (system) {
            const selectedSystemsArray = system.split(','); // 將以逗號分隔的字符串轉換為陣列
            const systemConditions = selectedSystemsArray.map((selectedSystem) => {
                return `System = '${selectedSystem}'`;
            });
            const systemConditionString = systemConditions.join(' OR ');
            query += ` AND (${systemConditionString})`;
        }
        if (period) {
            // You may need to adjust how you store and query for periods based on your data structure
            query += ` AND ClassPeriods LIKE '%${period}%'`;
        }
        if (courseCategory) {
            const selectedCategoriesArray = courseCategory.split(','); // 將以逗號分隔的字符串轉換為陣列
            const categoryConditions = selectedCategoriesArray.map((selectedCategory) => {
                return `CourseCategory = '${selectedCategory}'`;
            });
            const categoryConditionString = categoryConditions.join(' OR ');
            query += ` AND (${categoryConditionString})`;
        }
        if (teacherCode) {
            query += ` AND InstructorName = '${teacherCode}'`;
        }
        if (courseCode) {
            query += ` AND SubjectCode = '${courseCode}'`;
        }
        if (className) {
            query += ` AND ClassName = '${className}'`;
        }
        if (classCode) {
            query += ` AND ClassCode = '${classCode}'`;
        }
        if (numberOfStudents) {
            query += ` AND NumberOfStudents ${numberOfStudents}`;
        }
        // 執行查詢
        const result = await pool.request().query(query);

        // 打印結果到控制台
        console.log(result);

        // 將結果發送到客戶端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Courses table', err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/trans', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const newTrans = req.body; // 從請求主體中獲取新的交易資料



        // 將新的交易資料保存到資料庫
        const result = await pool.request()
            .input('AccID', sql.NVarChar, newTrans.AccID)
            .input('AtmID', sql.NVarChar, newTrans.AtmID)
            .input('TranType', sql.NVarChar, newTrans.TranType)
            .input('TranNote', sql.NVarChar, newTrans.TranNote)
            .input('UP_USR', sql.NVarChar, newTrans.UP_USR)
            .query('INSERT INTO Trans (AccID, AtmID, TranType, TranNote, UP_USR) VALUES (@AccID,  @AtmID, @TranType, @TranNote, @UP_USR)');

        res.status(201).json({ message: 'Transaction added successfully' });
    } catch (err) {
        console.error('Error adding new transaction', err);
        res.status(500).send('Internal Server Error');
    }
});
router.delete('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('DELETE FROM Trans WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;
        const updatedTrans = req.body;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .input('AccID', sql.NVarChar, updatedTrans.AccID)
            .input('AtmID', sql.NVarChar, updatedTrans.AtmID)
            .input('TranType', sql.NVarChar, updatedTrans.TranType)
            .input('TranNote', sql.NVarChar, updatedTrans.TranNote)
            .input('UP_USR', sql.NVarChar, updatedTrans.UP_USR)
            .query('UPDATE Trans SET AccID = @AccID, AtmID = @AtmID, TranType = @TranType, TranNote = @TranNote, UP_USR = @UP_USR, UP_DATETIME = GETDATE() WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error('Error updating transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params; // 從 URL 中獲取 TranID

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR FROM Trans WHERE TranID = @TranID');

        // 檢查是否找到了交易
        if (result.recordset.length === 0) {
            res.status(404).send('Transaction not found');
            return;
        }

        // 返回找到的交易
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying transaction by TranID', err);
        res.status(500).send('Internal Server Error');
    }
});


export default router;




