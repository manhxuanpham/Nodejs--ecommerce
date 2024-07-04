const NOTI_MODEL = require('../models/notification.model')

const pushNotiToSystem = async({
    type='SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content
    if(type == 'SHOP-001') {
        noti_content = `@@ vừa mới thêm sản phẩm mới`

    }
    else if (type == 'PROMOTION-001') {
        noti_content = `@@ vừa mới thêm một voucher`

    } else if (type == 'ORDER-001') {
        noti_content = `@@ vừa đặt hàng`
    } else if (type == 'ORDER-002') {
        noti_content = `@@ vừa phê duyệt hàng`
    }
    const newNoti = await NOTI_MODEL.create({
        noti_type:type,
        noti_content,
        noti_sender_id:senderId,
        noti_received_id:receivedId,
        noti_options: options
    })
    return newNoti
}
const listNotificationByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = { noti_received_id: userId }
    if (type !== 'All') {
        match['noti_type'] = type
    }
    return await NOTI_MODEL.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_sender_id: 1,
                noti_received_id: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr:['$noti_options.shop_name',0,-1]
                        },
                        'vừa mới thêm một sản phẩm mới',
                        {
                            $substr:['$noti_options.product_name',0,-1]
                        }
                    ]
                },
                createAt: 1,
                noti_options: 1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotificationByUser

}