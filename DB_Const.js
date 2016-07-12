/**
 * Created by Tabish Rizvi
 */

module.exports = {
    posts : {
        tableID : "post_id",
        orderKeys : {
            date : "date_created",
            title : "title"
        }
    },
    paragraphs : {
        tableID : "para_id",
        orderKeys : {
            text : "text"
        }
    },
    comments : {
        tableID : "comment_id",
        orderKeys : {
            date : "date_created"
        }
    }
};