/**
 * @typedef {Object} ClassInfo
 * @property {string} name
 * @property {string} teacher
 * @property {string} position
 * @property {number[]} weeks
 * @property {number} day
 * @property {number[]} sections
 */

/**
 * 
 * @param {string} html 
 * @returns 
 */
// @ts-ignore
function scheduleHtmlParser(html) {
    /** @type {ClassInfo[]} */
    const courseInfos = [];

    /**
     * @type {cheerio.Cheerio}
     */
    // @ts-ignore
    const classTables = $(".timetable_con");
    // console.log("timeTables", timeTables);

    for (let i = 0; i < classTables.length; i++) {
        console.log();


        const classTable = classTables[i];
        if (classTable.type !== "tag") continue;
        if (!classTable.children.length) continue;
        // console.log(timeTable.children);

        /**
         * @type {ClassInfo}
         */
        const temp = { name: "", position: "", teacher: "", weeks: [1, 2, 3, 4, 5, 6], day: 0, sections: [], };


        if (classTable.parent.type == "tag") {
            const [day, _] = classTable.parent.attribs.id.split("-");
            temp.day = Number(day) || temp.day;
        } // 设置当前为星期几

        // for (const children of timeTable.children) {
        for (let index = 0; index < classTable.children.length; index++) {
            const children = classTable.children[index];

            if (children.type !== "tag") continue;

            if (children.attribs.class === "title" && children.children[0].type === "tag") {


                for (let j = 0; j < children.children[0].children.length; j++) {
                    temp.name = children.children[0].children[j].data || temp.name;
                    temp.name = temp.name.replace(/☆|★/g, "");
                }
                console.log("title", temp.name);
                continue;
            }// 标题

            debugger;
            if (!children.children) continue;

            const iconElement = children.children[0];
            const descElement = children.children[1];
            let iconInfo = "";
            let descInfo = "";
            if (!iconElement || iconElement.type !== "tag") continue;
            if (!descElement || descElement.type !== "tag") continue;

            // console.log("children.childNodes", children.childNodes);

            for (let j = 0; j < iconElement.children.length; j++) {
                const element = iconElement.children[j];
                if (element.type !== "tag" || element.children[0].type != "tag") continue;
                iconInfo = element.children[0].attribs.class.trim().split(" ").pop() || "";
            }

            for (let j = 0; j < descElement.children.length; j++) {
                const element = descElement.children[j];
                // if (element.type !== "tag" || element.children[0].type != "tag") continue;
                descInfo = element.data || "";
                descInfo = descInfo.trim();
            }

            if (iconInfo === "glyphicon-time") { // 时间
                // @ts-ignore
                const match = /\((?<startSection>\d+)-(?<endSection>\d+)节\)(?<startWeek>\d+)-(?<endWeek>\d+)周\s*(?<classType>\([单|双]\))?/.exec(descInfo);

                const { startSection, endSection, startWeek, endWeek } =
                    // @ts-ignore
                    Object.fromEntries(Object.entries(match.groups).map(v => ([v[0], Number(v[1])])));
                const classType = (match?.groups?.classType || "").replace(/[\(|\)]+/g, "");
                console.log("glyphicon-time", match, classType);

                const sections = Array.from({ length: endSection - startSection + 1 }).map((_, i) => i + startSection);
                const weeks = Array.from({ length: endWeek - startWeek + 1 }).map((_, i) => i + startWeek);

                temp.weeks = weeks;
                temp.sections = sections;

                if (classType == "单") {
                    temp.weeks = temp.weeks.filter(v => v % 2 == 1);
                } else if (classType === "双") {
                    temp.weeks = temp.weeks.filter(v => v % 2 == 0);
                }

            } else if (iconInfo === "glyphicon-map-marker") { // 位置（只存在一个校区）
                temp.position = descInfo.replace("本部", "").trim();

            } else if (iconInfo === "glyphicon-user") {
                temp.teacher = descInfo;
            }

        }

        courseInfos.push(temp);

    }


    return courseInfos;
}


