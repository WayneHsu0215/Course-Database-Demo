/* eslint-disable no-unused-vars */
import { Router } from "express";
const router = Router();
import base64 from 'base64-js';
import axios from 'axios';
import * as fs from "fs";
import * as path from "path";

/** TODO: deprecate this */
router.post('/convert_Base64', (req, res) => {
    if (!req.body || !Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const responseArray = [];

    req.body.forEach(item => {
        if (!item.type || !item.coordinates) {
            throw new Error('Invalid item in the array');
        }

        const parsedCoordinates = item.coordinates.map(coord => {
            const [lat, lon] = coord.replace(/[()]/g, '').split(',').map(parseFloat);
            return [lat, lon];
        });

        const Anntemplate = {
            "0040A180": {
                "vr": "US",
                "Value": [1]
            },
            "00660016": {
                "vr": "OF",
                "InlineBinary": getEncodedData(parsedCoordinates)
            },
            "0066002F": { "vr": "SQ" },
            "00660030": { "vr": "SQ" },
            "00660040": { "vr": "OL", "InlineBinary": "AQAAAA==" },
            "006A0003": {
                "vr": "UI",
                "Value": ["2.25.114374900112750469872241075842855539572"]
            },
            "006A0005": { "vr": "LO", "Value": ["tumor"] },
            "006A0007": { "vr": "CS", "Value": ["MANUAL"] },
            "006A0008": {
                "vr": "SQ",
                "Value": [{
                    "00660031": { "vr": "LO", "Value": ["1.0"] },
                    "00660036": { "vr": "LO", "Value": ["ALOVAS-UI"] }
                }]
            },
            "006A0009": { "vr": "SQ" },
            "006A000A": { "vr": "SQ" },
            "006A000C": { "vr": "UL", "Value": [2] },
            "006A000D": { "vr": "CS", "Value": ["YES"] },
            "00700023": { "vr": "CS", "Value": [item.type] }
        };

        responseArray.push(Anntemplate);
    });

    res.json(responseArray);
});


function getEncodedData(coordinates) {
    const dataBytes = new Uint8Array(coordinates.length * 8);
    for (let i = 0; i < coordinates.length; i++) {
        const [lat, lon] = coordinates[i];
        const latBytes = new Float32Array([lat]);
        const lonBytes = new Float32Array([lon]);
        dataBytes.set(new Uint8Array(latBytes.buffer), i * 8);
        dataBytes.set(new Uint8Array(lonBytes.buffer), i * 8 + 4);
    }
    const encodedData = base64.fromByteArray(dataBytes);
    return encodedData;
}

async function fetchMetadata(studiesID, seriesID) {
    const url = `https://ditto.dicom.tw/dicom-web/studies/${studiesID}/series/${seriesID}/metadata`;

    try {
        const response = await axios.get(url);

        // 提取您需要的標籤
        const metadata = response.data;
        // console.log(response.data);
        const extractedData = {};

        const requiredTags = [
            "00080020",
            "00080030",
            "00080050",
            "00080090",
            "00081140",
            "00100020",
            "00100030",
            "00100040",
            "0020000D",
            "00200010",
            "00200011",
            "00200013",
            "00100010"
        ];

        requiredTags.forEach(tag => {
            if (metadata[0][tag]) {
                extractedData[tag] = { value: metadata[0][tag] };
            }
        });


        return extractedData;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        throw error;
    }
}

router.get('/anndata/studies/:studies/series/:series', async (req, res) => {
    const { studies, series } = req.params;

    try {
        const metadata = await fetchMetadata(studies, series);
        // res.json(metadata);

        const template = {
            "00020001": {
                "vr": "OB",
                "InlineBinary": "AAE="
            },
            "00020002": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00020003": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00020010": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.1.2.1"
                ]
            },
            "00020012": {
                "vr": "UI",
                "Value": [
                    "2.16.886.111.100006.100029.92583"
                ]
            },
            "00020013": {
                "vr": "SH",
                "Value": [
                    "PYDICOM 2.2.2"
                ]
            },
            "00080016": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00080018": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00080020": {
                "vr": "DA",
                "Value": [
                    metadata["00080020"].value
                ]
            },
            "00080023": {
                "vr": "DA",
                "Value": [
                    "20181003"
                ]
            },
            "00080030": {
                "vr": "TM",
                "Value": [
                    metadata["00080030"].value
                ]
            },
            "00080033": {
                "vr": "TM",
                "Value": [
                    "141016.791188"
                ]
            },
            "00080050": {
                "vr": "SH",
                "Value": [
                    metadata["00080050"].value
                ]
            },
            "00080060": {
                "vr": "CS",
                "Value": [
                    "ANN"
                ]
            },
            "00080070": {
                "vr": "LO",
                "Value": [
                    "NCKU SmileLAB"
                ]
            },
            "00080090": {
                "vr": "PN"
            },
            "00081090": {
                "vr": "LO",
                "Value": [
                    metadata["00080090"].value
                ]
            },
            "00081140": {
                "vr": "SQ",
                "Value": [
                    {
                        "00081150": {
                            "vr": "UI",
                            "Value": [
                                "1.2.840.10008.5.1.4.1.1.77.1.6"
                            ]
                        },
                        "00081155": {
                            "vr": "UI",
                            "Value": [
                                "2.16.840.1.113995.3.110.3.0.10118.2000002.862753.6"
                            ]
                        }
                    }
                ]
            },
            "00100010": {
                "vr": "PN",
                "Value": [
                    {
                        "Alphabetic": "Philips^Bob"
                    }
                ]
            },
            "00100020": {
                "vr": "LO",
                "Value": [
                    metadata["00100020"].value
                ]
            },
            "00100030": {
                "vr": "DA",
                "Value": [
                    metadata["00100030"].value
                ]
            },
            "00100040": {
                "vr": "CS",
                "Value": [
                    metadata["00100040"].value
                ]
            },
            "00181000": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "00181020": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "0020000D": {
                "vr": "UI",
                "Value": [
                    metadata["0020000D"].value
                ]
            },
            "0020000E": {
                "vr": "UI",
                "Value": [
                    "2.25.267046677599462464082038858145317682018"
                ]
            },
            "00200011": {
                "vr": "IS",
                "Value": [
                    metadata["00200011"].value
                ]
            },
            "00200013": {
                "vr": "IS",
                "Value": [
                    metadata["00200013"].value
                ]
            },
            "00480301": {
                "vr": "CS",
                "Value": [
                    "VOLUME"
                ]
            },
            "006A0001": {
                "vr": "CS",
                "Value": [
                    "2D"
                ]
            },
            "006A0002": {
                "vr": "SQ",
                "Value": [

                ]
            }
        }
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metadata' });
    }
});

const convertBase64 = (items) => items.map(item => {
    if (!item.type || !item.coordinates) {
        throw new Error('Invalid item in the array');
    }

    const parsedCoordinates = item.coordinates.map(coord => {
        const [lat, lon] = coord.replace(/[()]/g, '').split(',').map(parseFloat);
        return [lat, lon];
    });

    return {
        "0040A180": {
            "vr": "US",
            "Value": [1]
        },
        "00660016": {
            "vr": "OF",
            "InlineBinary": getEncodedData(parsedCoordinates)
        },
        "0066002F": {"vr": "SQ"},
        "00660030": {"vr": "SQ"},
        "00660040": {"vr": "OL", "InlineBinary": "AQAAAA=="},
        "006A0003": {
            "vr": "UI",
            "Value": ["2.25.114374900112750469872241075842855539572"]
        },
        "006A0005": {"vr": "LO", "Value": ["tumor"]},
        "006A0007": {"vr": "CS", "Value": ["MANUAL"]},
        "006A0008": {
            "vr": "SQ",
            "Value": [{
                "00660031": {"vr": "LO", "Value": ["1.0"]},
                "00660036": {"vr": "LO", "Value": ["ALOVAS-UI"]}
            }]
        },
        "006A0009": {"vr": "SQ"},
        "006A000A": {"vr": "SQ"},
        "006A000C": {"vr": "UL", "Value": [2]},
        "006A000D": {"vr": "CS", "Value": ["YES"]},
        "00700023": {"vr": "CS", "Value": [item.type]}
    };
})

router.post('/anndata/studies/:studies/series/:series', async (req, res) => {
    const { studies, series } = req.params;

    try {
        const convertBase64Response = convertBase64(req.body);

        const metadata = await fetchMetadata(studies, series);

        const template = {
            "00020001": {
                "vr": "OB",
                "InlineBinary": "AAE="
            },
            "00020002": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00020003": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00020010": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.1.2.1"
                ]
            },
            "00020012": {
                "vr": "UI",
                "Value": [
                    "2.16.886.111.100006.100029.92583"
                ]
            },
            "00020013": {
                "vr": "SH",
                "Value": [
                    "PYDICOM 2.2.2"
                ]
            },
            "00080016": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00080018": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00080020":
                    metadata["00080020"].value
            ,
            "00080023": {
                "vr": "DA",
                "Value": [
                    "20181003"
                ]
            },
            "00080030":
                    metadata["00080030"].value
                ,
            "00080033": {
                "vr": "TM",
                "Value": [
                    "141016.791188"
                ]
            },
            "00080050":
                    metadata["00080050"].value
                ,
            "00080060": {
                "vr": "CS",
                "Value": [
                    "ANN"
                ]
            },
            "00080070": {
                "vr": "LO",
                "Value": [
                    "NCKU SmileLAB"
                ]
            },
            "00080090": {
                "vr": "PN"
            },
            "00081090":
                    metadata["00080090"].value
                ,
            "00081140": {
                "vr": "SQ",
                "Value": [
                    {
                        "00081150": {
                            "vr": "UI",
                            "Value": [
                                "1.2.840.10008.5.1.4.1.1.77.1.6"
                            ]
                        },
                        "00081155": {
                            "vr": "UI",
                            "Value": [
                                "2.16.840.1.113995.3.110.3.0.10118.2000002.862753.6"
                            ]
                        }
                    }
                ]
            },
            "00100010":
                    metadata["00100010"].value
                ,
            "00100020":
                    metadata["00100020"].value
               ,
            "00100030":

                    metadata["00100030"].value

            ,
            "00100040":
                    metadata["00100040"].value
                ,
            "00181000": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "00181020": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "0020000D":
                    metadata["0020000D"].value
                ,
            "0020000E": {
                "vr": "UI",
                "Value": [
                    "2.25.267046677599462464082038858145317618"
                ]
            },
            "00200011":
                    metadata["00200011"].value
            ,
            "00200013":
                    metadata["00200013"].value
                ,
            "00480301": {
                "vr": "CS",
                "Value": [
                    "VOLUME"
                ]
            },
            "006A0001": {
                "vr": "CS",
                "Value": [
                    "2D"
                ]
            },
            "006A0002": {
                "vr": "SQ",
                "Value": convertBase64Response

            }
        }

        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metadata or convert Base64' });
    }
});




import { fileURLToPath } from 'url';
import { exec } from 'child_process';


// 将 import.meta.url 转换为文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'Upload'); // 移除了前面的斜杠


function convertJsonToDicom(jsonFilePath, outputDir) {
    return new Promise((resolve, reject) => {
        // 构造 DICOM 文件路径
        const dicomFileName = path.basename(jsonFilePath, '.json') + '.dcm';
        const dicomFilePath = path.join(outputDir, dicomFileName);

        // 构建转换命令
        const command = `json2dcm -j "${jsonFilePath}" -o "${dicomFilePath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing json2dcm: ${error}`);
                return reject(error);
            }
            console.log(`DICOM file created: ${dicomFilePath}`);
            resolve(dicomFilePath);
        });
    });
}

// 确保目录存在
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // 添加 { recursive: true } 以确保父目录被创建
}

function generateFileName() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    console.log(timestamp);
    return `template_${timestamp}.json`;
}

const dicomOutputDir = path.join(__dirname, 'DicomFiles');
// 确保 DICOM 文件的输出目录存在
if (!fs.existsSync(dicomOutputDir)) {
    fs.mkdirSync(dicomOutputDir, { recursive: true });
}
async function saveTemplate(template) {
    const fileName = generateFileName();
    const jsonFilePath = path.join(uploadDir, fileName);
    const templateJSON = JSON.stringify(template, null, 2);
    try {
        await fs.promises.writeFile(jsonFilePath, templateJSON);
        console.log(`Template saved to ${jsonFilePath}`);

        await convertJsonToDicom(jsonFilePath, dicomOutputDir)
            .then(dicomFilePath => {
                return uploadDicomFile(dicomFilePath);
            })
            .then(dicomFilePath => {
                console.log(`Successfully uploaded DICOM file: ${dicomFilePath}`);
            })
            .catch(error => {
                console.error(`Error in converting or uploading DICOM file: ${error}`);
            });

    } catch (error) {
        console.error('Error in process:', error);
        throw error;
    }
}


function uploadDicomFile(dicomFilePath) {
    return new Promise((resolve, reject) => {
        // 构造上传命令
        const command = `dcmsend -v -aet LIENSCU -aec RACCOONQRSCP 140.131.93.145 11112 "${dicomFilePath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error uploading DICOM file: ${error}`);
                return reject(error);
            }
            console.log(`DICOM file uploaded: ${dicomFilePath}`);
            console.log(stdout); // 输出详细信息
            resolve(dicomFilePath);
        });
    });
}

router.post('/SaveAnnData/studies/:studies/series/:series', async (req, res) => {
    const { studies, series } = req.params;

    try {
        const convertBase64Response = convertBase64(req.body);

        const metadata = await fetchMetadata(studies, series);

        const template = {
            "00020001": {
                "vr": "OB",
                "InlineBinary": "AAE="
            },
            "00020002": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00020003": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00020010": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.1.2.1"
                ]
            },
            "00020012": {
                "vr": "UI",
                "Value": [
                    "2.16.886.111.100006.100029.92583"
                ]
            },
            "00020013": {
                "vr": "SH",
                "Value": [
                    "PYDICOM 2.2.2"
                ]
            },
            "00080016": {
                "vr": "UI",
                "Value": [
                    "1.2.840.10008.5.1.4.1.1.91.1"
                ]
            },
            "00080018": {
                "vr": "UI",
                "Value": [
                    "2.25.231377583480722467029604168999944315442"
                ]
            },
            "00080020":
            metadata["00080020"].value
            ,
            "00080023": {
                "vr": "DA",
                "Value": [
                    "20181003"
                ]
            },
            "00080030":
            metadata["00080030"].value
            ,
            "00080033": {
                "vr": "TM",
                "Value": [
                    "141016.791188"
                ]
            },
            "00080050":
            metadata["00080050"].value
            ,
            "00080060": {
                "vr": "CS",
                "Value": [
                    "ANN"
                ]
            },
            "00080070": {
                "vr": "LO",
                "Value": [
                    "NCKU SmileLAB"
                ]
            },
            "00080090": {
                "vr": "PN"
            },
            "00081090":
            metadata["00080090"].value
            ,
            "00081140": {
                "vr": "SQ",
                "Value": [
                    {
                        "00081150": {
                            "vr": "UI",
                            "Value": [
                                "1.2.840.10008.5.1.4.1.1.77.1.6"
                            ]
                        },
                        "00081155": {
                            "vr": "UI",
                            "Value": [
                                "2.16.840.1.113995.3.110.3.0.10118.2000002.862753.6"
                            ]
                        }
                    }
                ]
            },
            "00100010":
            metadata["00100010"].value
            ,
            "00100020":
            metadata["00100020"].value
            ,
            "00100030":

            metadata["00100030"].value

            ,
            "00100040":
            metadata["00100040"].value
            ,
            "00181000": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "00181020": {
                "vr": "LO",
                "Value": [
                    "1"
                ]
            },
            "0020000D":
            metadata["0020000D"].value
            ,
            "0020000E": {
                "vr": "UI",
                "Value": [
                    "2.25.26704667759946246400388453176183123"
                ]
            },
            "00200011":
            metadata["00200011"].value
            ,
            "00200013":
            metadata["00200013"].value
            ,
            "00480301": {
                "vr": "CS",
                "Value": [
                    "VOLUME"
                ]
            },
            "006A0001": {
                "vr": "CS",
                "Value": [
                    "2D"
                ]
            },
            "006A0002": {
                "vr": "SQ",
                "Value": convertBase64Response

            }
        }

        await saveTemplate(template);
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metadata or convert Base64' });
    }
});



export default router;


