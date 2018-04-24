"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function selectRows(selected, row, comparefn) {
    var selectedIndex = comparefn(row, selected);
    return changeSelectStatusForRow(selected, row, selectedIndex);
}
exports.selectRows = selectRows;
function selectRowsTree(selected, row, comparefn) {
    if (comparefn(row, selected) === -1) {
        selected.push(row);
    }
    else {
        var selectedIndexs = [];
        selectedIndexs = flattenTreeIndexs(selected, row, comparefn, selectedIndexs);
        selectedIndexs.forEach(function (idx) { return selected.splice(idx, 1, null); });
        selected = lodash_1.compact(selected);
    }
    return selected;
}
exports.selectRowsTree = selectRowsTree;
function flattenTreeIndexs(selected, row, comparefn, selectedIndexs) {
    var rowIndex = comparefn(row, selected);
    if (rowIndex > -1) {
        selectedIndexs.push(rowIndex);
    }
    if (row.children && row.children.length > 0) {
        row.children.forEach(function (childRow) {
            flattenTreeIndexs(selected, childRow, comparefn, selectedIndexs);
        });
    }
    return selectedIndexs;
}
function changeSelectStatusForRow(selected, row, selectedIndex) {
    if (selectedIndex > -1) {
        selected.splice(selectedIndex, 1);
    }
    else {
        selected.push(row);
    }
    return selected;
}
function selectRowsBetween(selected, rows, index, prevIndex, comparefn) {
    var reverse = index < prevIndex;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var greater = i >= prevIndex && i <= index;
        var lesser = i <= prevIndex && i >= index;
        var range = { start: 0, end: 0 };
        if (reverse) {
            range = {
                start: index,
                end: prevIndex
            };
        }
        else {
            range = {
                start: prevIndex,
                end: index + 1
            };
        }
        if ((reverse && lesser) || (!reverse && greater)) {
            // if in the positive range to be added to `selected`, and
            // not already in the selected array, add it
            if (i >= range.start && i <= range.end) {
                selected.push(row);
            }
        }
    }
    return selected;
}
exports.selectRowsBetween = selectRowsBetween;
//# sourceMappingURL=selection.js.map