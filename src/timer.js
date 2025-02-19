/**
 * @typedef {Object} ScheduleTimer
 * @property {ClassInfo[]} parserRes
 * @property {*} providerRes
 */

/**
 * 时间配置函数，此为入口函数，不要改动函数名
 * @param {ScheduleTimer} param0 
 * @returns 
 */
async function scheduleTimer({ providerRes, parserRes } = { parserRes: [], providerRes: [] }) {


    const maxWeek = Math.max(...parserRes.map(v => v.weeks.pop() || 0));

    /**
     * 
     * @param {string} time 
     * @returns 
     */
    const summer = (time) => {
        const month = new Date().getMonth() + 1;
        if (!(5 <= month && month <= 9)) return time;
        const [h, m] = time.split(":");
        const min = Number(h) * 60 + Number(m) + 30;
        return `${Math.floor(min / 60)}`.padStart(2, "0") + `:` + `${(min % 60)}`.padStart(2, "0");
    };

    const sections = [
        { section: 1, startTime: '08:00', endTime: '08:45', },
        { section: 2, startTime: '08:55', endTime: '09:40', },
        { section: 3, startTime: '10:00', endTime: '10:45', },
        { section: 4, startTime: '10:55', endTime: '11:40', },

        { section: 5, startTime: summer('14:00'), endTime: summer('14:45'), },
        { section: 6, startTime: summer('14:55'), endTime: summer('15:40'), },
        { section: 7, startTime: summer('16:00'), endTime: summer('16:45'), },
        { section: 8, startTime: summer('16:55'), endTime: summer('17:40'), },

        { section: 9, startTime: '19:00', endTime: '19:45', },
        { section: 10, startTime: '19:55', endTime: '20:40', },
    ];

    // 晚上课程数量
    const nightLessonNum = Math.max(Math.max(...parserRes.map(v => v.sections).flat()), 8) - 8;
    return {
        totalWeek: maxWeek, // 总周数：[1, 30]之间的整数
        startSemester: '1739750400000', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: !!parserRes.find(v => v.day === 7 || v.day === 6), // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: nightLessonNum, // 晚间课程节数：[0, 10]之间的整数
        sections: sections.slice(0, 8 + nightLessonNum), // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    };
}