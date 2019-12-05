/**
 * 数据映射
 * @param list 数据源
 * @param structure 新结构
 * @param expand 拓展数据
 * @returns {[]}
 */
export function changeKeys(list, structure = {
    title: "name",
    value: "id",
    key: "id",
    children: "children"
}, expand = {}) {
    let newList = [];
    if (!Array.isArray(list)) return [];
    list.forEach((item) => {
        let temp = {...expand};
        for (let key in structure) {
            if (structure[key] instanceof Function) {
                temp[key] = structure[key](item);
            } else {
                let value = item[structure[key]];
                if ((value instanceof Array) && value.length) {
                    temp[key] = changeKeys(value, structure, expand);
                } else {
                    if (value) temp[key] = value;
                }
            }
        }
        newList.push(temp);
    });
    return newList;
}

/**
 * 获取指定字段值
 * @param list 数据源
 * @param options
 * @returns {Array}
 */
export function getFieldsValue(list, options = {}) {
    let opt = {
        parentField: 'parent_id',
        parentId: '',
        childrenField: 'children',
        field: 'id',
        isSelf: true,
        ...options
    };
    let newList = [];
    if (opt.isSelf) newList.push(opt.parentId);
    if (!Array.isArray(list)) return newList;
    list.forEach((item) => {
        if (item[opt.parentField] === opt.parentId) newList.push(item[opt.field]);
        if (Array.isArray(item[opt.childrenField]) && item[opt.childrenField].length) {
            let option = {
                ...opt,
                parentId: (item[opt.parentField] === opt.parentId) ? item[opt.field] : opt.parentId,
                isSelf: false
            };
            let children = getFieldsValue(item[opt.childrenField], option);
            if (children) newList = [...newList, ...children];
        }
    });
    return newList;
}

/**
 * 获取所有父级
 * @param list 树形结构
 * @param field 字段名
 * @param value 值
 * @returns {boolean|*[]|*[]}
 */
export function getParents(list, field, value) {
    for (let key in list) {
        const item = list[key];
        if (item[field] === value) {
            return [item];
        }
        if (item.children && item.children.length > 0) {
            const temp = getParents(item.children, field, value);
            if (temp) {
                return [item, ...temp];
            }
        }
    }
    return false;
}

/**
 * 是否外部链接
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 数组转字符串
 * @param arr
 * @returns {string}
 */
export function arrayToString(arr) {
    if (arr instanceof Array) {
        return String(arr);
    }
    return '';
}

/**
 * 字符串转数组
 * @param str
 * @returns {Array|*}
 */
export function stringToArray(str) {
    return str ? str.split(',') : [];
}

/**
 * 布尔转字符串
 * @param bool
 * @returns {string}
 */
export function booleanToString(bool) {
    return bool ? '1' : '0';
}

/**
 * 字符串转布尔
 * @param str
 * @returns {boolean}
 */
export function stringToBoolean(str) {
    return str === '1' ? true : false;
}

/**
 * 树形结构转线形结构
 * @param data
 * @returns {Array}
 */
export function treeToList(data = []) {
    let list = [];
    if (!Array.isArray(data)) return list;
    data.forEach(item => {
        let temp = [];
        list.push(item);
        if (item.children && item.children.length) {
            let children = treeToList(item.children);
            if (children.length) {
                temp = children;
            }
        }
        list = [...list, ...temp];
    });
    return list;
}

/**
 * 线形数据转树形数据
 * @param list
 * @param parentId
 * @returns {[]}
 */
export function listToTree(list = [], parentId = '0') {
    const tree = [];
    list.forEach(item => {
        if (item.parentId === parentId) {
            let temp = item;
            let children = listToTree(list, item.id);
            if (children.length) {
                temp.children = children;
            }
            tree.push(temp);
        }
    });
    return tree;
};

export function timeFix() {
    const time = new Date();
    const hour = time.getHours();
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}