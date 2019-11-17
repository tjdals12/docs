import XLSX from 'xlsx';
import stream from 'stream';

/**
 * @author      minz-logger
 * @date        2019. 11. 17
 * @description 엑셀로 저장
 * @param       {Array} data
 * @param       {Function} callback
 */
export const exportExcel = async (data, callback) => {
    if(!data || data.length <= 0) {
        callback(null, 'No data');
        return;
    }

    const newWorkBook = XLSX.utils.book_new();
    await XLSX.utils.book_append_sheet(
        newWorkBook,
        XLSX.utils.json_to_sheet(data, {
            header: Object.keys(data[0])
        }),
        'output'
    );

    const bufferStream = new stream.PassThrough();
    callback(await bufferStream.end(new Buffer.from(XLSX.write(newWorkBook, { type: 'buffer' }))));
};