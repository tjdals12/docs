import Project from 'models/project/project';
import Vendor from 'models/vendor/vendor';
import DocumentIndex from 'models/documentIndex/documentIndex';
import DocumentInfo from 'models/documentIndex/documentInfo';
import VendorLetter from 'models/vendorLetter/vendorLetter';

/**
 * @author      minz-logger
 * @date        2019. 11. 21
 * @description 대시보드 데이터 조회
 */
export const getDatas = async (ctx) => {
    const { id } = ctx.params;

    try{
        console.time('Project');
        const project = await Project.findOne({ _id: id }, { projectName: 1, effStaDt: 1, effEndDt: 1 });
        console.timeEnd('Project');

        console.time('Vendor');
        const contractedVendors = await Vendor.find({ project: id }, { _id: 1 })
            .then(vendors => vendors.map(vendor => vendor._id));
        console.timeEnd('Vendor');

        console.time('Documents');
        const managedDocuments = await DocumentIndex.find({ vendor: { $in: contractedVendors } }, { _id: 0, list: 1 })
            .then(indexes => indexes.map(index => index.list)[0]);
        const currentReceivedDocuments = await DocumentInfo.countDocuments(
            {
                $and: [
                    { _id: { $in: managedDocuments } },
                    { 'trackingDocument.0': { $exists: true } }
                ]
            }
        );
        console.timeEnd('Documents');

        console.time('Vendor Letters');
        const currentReeceivedVendorLetters = await VendorLetter.countDocuments({ vendor: { $in: contractedVendors } });
        const repliedVendorLetters = await VendorLetter.countDocuments(
            {
                $and: [
                    { vendor: { $in: contractedVendors } },
                    { letterStatus: {
                        $elemMatch: {
                            status: { $in: [ '90', '91', '92', '93', '94' ] }
                        }
                    }}
                ]
            }
        );
        console.timeEnd('Vendor Letters');

        ctx.res.ok({
            data: {
                project,
                contractedVendors: contractedVendors.length,
                managedDocuments: {
                    total: managedDocuments.length,
                    current: currentReceivedDocuments,
                    percentage: Math.ceil(((currentReceivedDocuments /managedDocuments.length) * 100))
                },
                receivedDocuments: {
                    received: currentReeceivedVendorLetters,
                    replied: repliedVendorLetters,
                    percentage: Math.ceil(((repliedVendorLetters / currentReceivedDocuments) * 100))
                }
            },
            message: 'Success - dashboardCtrl > getDatas'
        });
    }catch(e){
        ctx.res.internalServerError({
            data: { id },
            message: `Error - dashboardCtrl > getDatas: ${e.message}`
        });
    }
};