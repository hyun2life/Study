'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { google } = require('googleapis');
const { getAuthClient } = require('./google_auth');

function classifyError(err) {
    const text = String(err && (err.message || err));
    if (/invalid_grant|401|UNAUTHENTICATED|OAuth|token/i.test(text)) return 10;
    if (/429|503|rate.?limit|quota/i.test(text)) return 11;
    return 1;
}

async function getSheetMeta(spreadsheetId, title) {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const meta = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets(properties(sheetId,title,index))',
    });
    const sheet = (meta.data.sheets || []).find(s => s.properties.title === title);
    return { sheets, sheet };
}

async function duplicateTab(spreadsheetId, sourceTitle, targetTitle) {
    const { sheets, sheet } = await getSheetMeta(spreadsheetId, sourceTitle);
    if (!sheet) process.exit(2);

    const exists = (await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties(title)',
    })).data.sheets.find(s => s.properties.title === targetTitle);
    if (exists) process.exit(3);

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{
                duplicateSheet: {
                    sourceSheetId: sheet.properties.sheetId,
                    newSheetName: targetTitle,
                },
            }],
        },
    });
    console.log(`duplicated:${sourceTitle}->${targetTitle}`);
}

async function deleteTab(spreadsheetId, title) {
    const { sheets, sheet } = await getSheetMeta(spreadsheetId, title);
    if (!sheet) process.exit(2);
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{
                deleteSheet: {
                    sheetId: sheet.properties.sheetId,
                },
            }],
        },
    });
    console.log(`deleted:${title}`);
}

async function renameTab(spreadsheetId, title, nextTitle) {
    const { sheets, sheet } = await getSheetMeta(spreadsheetId, title);
    if (!sheet) process.exit(2);
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{
                updateSheetProperties: {
                    properties: {
                        sheetId: sheet.properties.sheetId,
                        title: nextTitle,
                    },
                    fields: 'title',
                },
            }],
        },
    });
    console.log(`renamed:${title}->${nextTitle}`);
}

async function main() {
    const [spreadsheetId, arg1, arg2, arg3] = process.argv.slice(2);
    if (!spreadsheetId || !arg1) {
        console.error('사용법: node duplicate_tab.js <spreadsheetId> <sourceTab> <targetTab>');
        console.error('       node duplicate_tab.js <spreadsheetId> <tabName> --delete');
        console.error('       node duplicate_tab.js <spreadsheetId> <tabName> --rename <newName>');
        process.exit(1);
    }

    if (arg2 === '--delete') {
        await deleteTab(spreadsheetId, arg1);
        return;
    }

    if (arg2 === '--rename') {
        if (!arg3) {
            console.error('새 탭명이 필요합니다.');
            process.exit(1);
        }
        await renameTab(spreadsheetId, arg1, arg3);
        return;
    }

    if (!arg2) {
        console.error('복제 대상 탭명을 입력하세요.');
        process.exit(1);
    }
    await duplicateTab(spreadsheetId, arg1, arg2);
}

main().catch(err => {
    console.error(err.message || err);
    process.exit(classifyError(err));
});
