import {Helmet} from 'react-helmet';
import React, {useState} from 'react';
import {Icon} from '@iconify/react';
import Modal from "./Modal.jsx";

const Ntunhssu = () => {

    const [teacherCode, setTeacherCode] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [className, setClassName] = useState("");
    const [classCode, setClassCode] = useState("");
    const [numberOfStudentsOperator, setNumberOfStudentsOperator] = useState("");
    const [numberOfStudents, setNumberOfStudents] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const SESSIONS = Object.freeze({
        1: {name: '1', time: ['08:10', '09:00']},
        2: {name: '2', time: ['09:10', '10:00']},
        3: {name: '3', time: ['10:10', '11:00']},
        4: {name: '4', time: ['11:10', '12:00']},
        5: {name: '5', time: ['12:40', '13:30']},
        6: {name: '6', time: ['13:40', '14:30']},
        7: {name: '7', time: ['14:40', '15:30']},
        8: {name: '8', time: ['15:40', '16:30']},
        9: {name: '9', time: ['16:40', '17:30']},
        A: {name: '10', time: ['17:40', '18:30']},
        B: {name: '11', time: ['18:35', '19:25']},
        C: {name: '12', time: ['19:30', '20:20']},
        D: {name: '13', time: ['20:25', '21:15']},
        E: {name: '14', time: ['21:20', '22:10']},
    });
    const weekday = ["1", "2", "3", "4", "5", "6", "7"];

    const grade = ['1', '2', '3', '4', '5', '6', '7'];

    const courseCategories = [
        '跨校', '跨域課程', '全英語授課', 'EMI全英語授課', '同步遠距教學',
        '非同步遠距教學', '混合式遠距教學', '遠距教學課程', '遠距輔助課程'
    ];

    const systems = ['二技', '二技(三年)', '四技', '學士後多元專長', '碩士班', '博士班', '學士後學位學程', '學士後系'];


    const [isOpen, setIsOpen] = useState({
        semester: false,
        system: false,
        departmentGradeType: false,
        weekday: false,
        period: false,
        courseCategory: false,
        teacherCourse: false
    });
    const toggleAllDropdowns = (value) => {
        setIsOpen(prevState => ({
            semester: value,
            system: value,
            departmentGradeType: value,
            weekday: value,
            period: value,
            courseCategory: value,
            teacherCourse: value
        }));
    }
    const handleTeacherCodeChange = (event) => {
        setTeacherCode(event.target.value);
    };

    const handleCourseCodeChange = (event) => {
        setCourseCode(event.target.value);
    };

    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async ( semester,
                                 department,
                                 grade,
                                 courseType, // Ensure it's one of the parameters
                                 weekday,
                                 system,
                                 period,
                                 courseCategory,
                                 teacherCode,
                                 courseCode,
                                 className,
                                 classCode,
                                 numberOfStudentsOperator,
                                 numberOfStudents) => {
        try {
            const response = await fetch(`/api/search?semester=${semester}&department=${department}&grade=${grade}&courseType=${courseType}&weekday=${weekday}&system=${system}&period=${period}
            &courseCategory=${courseCategory}&teacherCode=${teacherCode}&courseCode=${courseCode}&className=${className}&classCode=${classCode}&numberOfStudentsOperator=${numberOfStudentsOperator}&numberOfStudents=${numberOfStudents}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const toggleDropdown = (section) => {
        setIsOpen(prevState => ({...prevState, [section]: !prevState[section]}));
    }

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.ok) {
                console.log('File uploaded successfully');
                setUploadProgress(0); // Reset progress after successful upload
            } else {
                throw new Error('File upload failed');
            }
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedWeekday, setSelectedWeekday] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");

    const handleGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };
    const handleWeekdayChange = (event) => {
        setSelectedWeekday(event.target.value);
    };
    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };
    const [selectedSemester, setSelectedSemester] = useState("");

    const handleSemesterChange = (event) => {
        setSelectedSemester(event.target.value);
    };


    const [selectedSystems, setSelectedSystems] = useState([]);

    const handleSystemChange = (event) => {
        const value = event.target.value;
        setSelectedSystems((prevSelectedSystems) => {
            if (prevSelectedSystems.includes(value)) {
                return prevSelectedSystems.filter((system) => system !== value);
            } else {
                return [...prevSelectedSystems, value];
            }
        });
    };

    const [selectedCourseCategories, setSelectedCourseCategories] = useState([]);

    const handleCourseCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCourseCategories((prevSelectedCourseCategories) => {
            if (prevSelectedCourseCategories.includes(value)) {
                return prevSelectedCourseCategories.filter((category) => category !== value);
            } else {
                return [...prevSelectedCourseCategories, value];
            }
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>課程查詢系統</title>
            </Helmet>
            <div>
                匯入Excel
                <input type="file" onChange={handleFileUpload} />
                {uploadProgress > 0 && (
                    <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                        <div style={{ height: '10px', width: `${uploadProgress}%`, backgroundColor: 'green' }}></div>
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded shadow-md max-w-7xl mx-auto">
                <ul className="flex border-b mb-3 ">
                    <li className="-mb-px mr-1">
                        <a className="bg-white inline-block border-l border-t border-r rounded-t py-1 px-2 text-green-500 font-semibold"
                           href="/"><Icon className="inline mx-2 text-2xl " icon="line-md:cloud-print-outline-loop" />課程查詢系統</a>
                    </li>
                    <li className="mr-1">
                        <a
                            className="bg-white inline-block py-1 px-2 text-green-500 hover:text-green-800 font-semibold"
                            href="https://system8.ntunhs.edu.tw/myNTUNHS_student/Modules/Main/Index_student.aspx?first=true"
                            target="_blank"
                            rel="noopener noreferrer">e-protfolio 學習歷程<Icon className="inline mx-2 text-2xl "
                                                                                icon="line-md:person-search-twotone" />
                        </a>
                    </li>
                    <li className="mr-1">
                        <a
                            className="bg-white inline-block py-1 px-2 text-green-500 hover:text-green-800 font-semibold"
                            href="https://system16.ntunhs.edu.tw/myNTUNHS_coc/Modules/Main/Index_COC.aspx"
                            target="_blank"
                            rel="noopener noreferrer">選課系統</a>
                    </li>
                </ul>
                <div className="flex">
                    <h1 className="text-2xl font-bold mb-4">國立臺北護理健康大學 課程查詢系統<Icon
                        className="inline mx-2 text-2xl " icon="line-md:text-box" /></h1>

                    <button type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="ml-auto  hover:bg-red-500/50  border w-32 p-2 rounded-lg font-bold bg-red-300/50 text-gray-700  border-red-600/50 border-2 items-center"><Icon
                        className="inline mx-2 text-2xl " icon="line-md:question-circle" />注意事項</button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4">注意事項<Icon
                            className="inline mx-2 text-2xl " icon="svg-spinners:blocks-shuffle-3" /></h1>

                        <div>

                            <p className="text-lg text-red-600 font-bold mb-4">※本查詢執行速度比舊的快，別用舊系統了 。</p>
                            <p className="text-lg font-bold mb-4">※所有欄位皆提供模糊查詢，請安心使用。</p>
                            <p className="text-lg font-bold mb-4">※選課日程及注意事項等請詳閱教務處網站選課公告</p>
                            <p className="text-lg font-bold mb-4 flex justify-center">&#8203;``【oaicite:0】``&#8203;</p>
                        </div>
                    </div>
                </Modal>
                <form className="space-y-4">


                    <div className="w-2/5">
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">學期：</label>
                        <select id="semester" className="mt-1 block w-full py-2 px-3 border rounded-md" onChange={handleSemesterChange}>
                            <option value="">請選擇學期</option>
                            <option value="1121">112學年度上學期</option>
                            <option value="1112">111學年度下學期</option>
                            {/* 添加更多學期選項 */}
                        </select>
                    </div>

                    <div className="flex h-0.5 justify-center items-start text-xs text-gray-400">
                        <button
                            className="mx-8"
                            type="button"
                            onClick={() => toggleAllDropdowns(true)}>  {/* 打開所有下拉框 */}
                            展開全部{"<>"}
                        </button>

                        <button
                            className="mx-8"
                            type="button"
                            onClick={() => toggleAllDropdowns(false)}> {/* 關閉所有下拉框 */}
                            收起全部{"><"}
                        </button>
                    </div>
                    <div className="flex justify-center w-full">
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.departmentGradeType ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('departmentGradeType')}>
                            系所/年級/課別 {isOpen.departmentGradeType ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.weekday ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('weekday')}>
                            星期 {isOpen.weekday ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.system ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('system')}>
                            學制 {isOpen.system ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>
                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.period ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('period')}>
                            節次 {isOpen.period ? <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>

                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.courseCategory ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('courseCategory')}>
                            課程內容分類 {isOpen.courseCategory ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>

                        <button
                            className={`m-2 text-white px-4 py-2 rounded ${isOpen.teacherCourse ? 'bg-green-700 hover:bg-green-900' : 'bg-green-500 hover:bg-green-700'}`}
                            type="button" onClick={() => toggleDropdown('teacherCourse')}>
                            教師/課程 {isOpen.teacherCourse ?
                            <Icon className="inline text-2xl mx-1" icon="line-md:upload-loop" /> :
                            <Icon className="inline text-2xl mx-1" icon="line-md:download-loop" />}
                        </button>
                    </div>
                    <div>

                        {isOpen.system && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">學制：</label>
                                {systems.map((system, index) => (
                                    <label key={index} className="inline-flex items-center">
                                        <input type="checkbox" className="form-checkbox" name="system" value={system} onChange={handleSystemChange} />
                                        <span className="ml-2">{system}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>

                        <div className="flex justify-between w-full">

                            {isOpen.departmentGradeType && (

                                <div className="w-full flex  justify-between ">

                                    <div className="w-3/4 ">
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">系所：</label>
                                        <select id="department" className="mt-1 block w-full py-2 px-3 border rounded-md" onChange={handleDepartmentChange}>
                                            <option value="">請選擇系所</option>
                                            <option value="護理系">護理系</option>
                                            <option value="高齡健康照護系">高齡健康照護系</option>
                                            {/* 添加更多系所選項 */}
                                        </select>
                                    </div>

                                    <div className="w-3/4 mx-4">
                                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">年級：</label>
                                        <select id="grade" className="mt-1 block w-full py-2 px-3 border rounded-md" onChange={handleGradeChange}>
                                            <option value="">請選擇年級</option>
                                            {grade.map((g, index) => (
                                                <option key={index} value={g}>{`${g}年級`}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">課別：</label>
                                        {courseCategories.map((category, index) => (
                                            <label key={index} className="inline-flex items-center">
                                                <input type="checkbox" className="form-checkbox" name="courseCategory" value={category} onChange={handleCourseCategoryChange} />
                                                <span className="ml-2">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    <div>

                        {isOpen.weekday && (
                            <div className="">
                                <label htmlFor="weekday" className="block text-sm font-medium text-gray-700">星期：</label>
                                <select id="weekday" className="mt-1 block w-full py-2 px-3 border rounded-md" onChange={handleWeekdayChange}>
                                    <option value="">請選擇星期</option>
                                    {weekday.map((day, index) => (
                                        <option key={index} value={day}>{`星期${day}`}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div>

                        {isOpen.period && (
                            <div className="flex flex-col items-start w-full">
                                <label className="block text-sm font-medium text-gray-700">節次：</label>
                                <div className="border rounded-l p-4 grid grid-cols-4 gap-4 w-full">
                                    {Object.entries(SESSIONS).map(([key, session]) => (
                                        <label key={key} className="flex items-center space-x-2">
                                            <input type="checkbox" className="form-checkbox" name="period"
                                                   value={`節${session.name}`} />
                                            <span>{`第${session.name}節(${session.time[0]}~${session.time[1]})`}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {isOpen.courseCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">課程內容分類：</label>
                                <div className="border rounded-l p-4 grid grid-cols-3 gap-4">
                                    {courseCategories.map(category => (
                                        <label key={category} className="inline-flex items-center">
                                            <input type="checkbox" className="form-checkbox" name="courseCategory" value={category} />
                                            <span className="ml-2">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="mt-4">
                            <button type="button" onClick={() => handleSearch(semester, department, grade, courseType, weekday, system, period, courseCategory,teacherCode,courseCode,className,classCode,numberOfStudentsOperator,numberOfStudents)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                <Icon className="inline text-2xl mx-1" icon="line-md:search-filled"/>查詢
                            </button>

                        </div>
                        <div>
                            {/* 這裡顯示查詢結果 */}
                            {searchResults.length > 0 ? (
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg divide-y divide-gray-300 table-auto">
                                    <thead>
                                    <tr>
                                        {/* 根據您的數據結構調整表頭 */}
                                        <th className="py-2 px-4 border-b border-gray-300">編號</th>
                                        <th className="py-2 px-4 border-b border-gray-300">學期</th>
                                        <th className="py-2 px-4 border-b border-gray-300">系所</th>
                                        <th className="py-2 px-4 border-b border-gray-300">年級</th>
                                        <th className="py-2 px-4 border-b border-gray-300">班組</th>
                                        <th className="py-2 px-4 border-b border-gray-300">科目代號</th>
                                        <th className="py-2 px-4 border-b border-gray-300">課程名稱</th>
                                        <th className="py-2 px-4 border-b border-gray-300">教師姓名</th>
                                        <th className="py-2 px-4 border-b border-gray-300">上課人數</th>
                                        <th className="py-2 px-4 border-b border-gray-300">學分數</th>
                                        <th className="py-2 px-4 border-b border-gray-300">課別</th>
                                        <th className="py-2 px-4 border-b border-gray-300">地點</th>
                                        <th className="py-2 px-4 border-b border-gray-300">星期</th>
                                        <th className="py-2 px-4 border-b border-gray-300">節次</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchResults.map((result, index) => (
                                        <tr key={index}>
                                            {/* 根據您的數據結構調整顯示的字段 */}
                                            <td className="py-2 px-4">{result.id}</td>
                                            <td className="py-2 px-4">{result.semester}</td>
                                            <td className="py-2 px-4">{result.department}</td>
                                            <td className="py-2 px-4">{result.grade}</td>
                                            <td className="py-2 px-4">{result.classGroup}</td>
                                            <td className="py-2 px-4">{result.subjectCode}</td>
                                            <td className="py-2 px-4">{result.courseName}</td>
                                            <td className="py-2 px-4">{result.instructorName}</td>
                                            <td className="py-2 px-4">{result.numberOfStudents}</td>
                                            <td className="py-2 px-4">{result.credits}</td>
                                            <td className="py-2 px-4">{result.courseType}</td>
                                            <td className="py-2 px-4">{result.location}</td>
                                            <td className="py-2 px-4">{result.weekday}</td>
                                            <td className="py-2 px-4">{result.period}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No results found</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Ntunhssu;
