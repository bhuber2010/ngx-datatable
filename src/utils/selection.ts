import { compact } from 'lodash';

export function selectRows(selected: any[], row: any, comparefn: any) {
  const selectedIndex = comparefn(row, selected);
  return changeSelectStatusForRow(selected, row, selectedIndex);
}

export function selectRowsTree(selected: any[], row: any, comparefn: any) {
  if (comparefn(row, selected) === -1) {
    selected.push(row);
  } else {
    let selectedIndexs: any[] = [];
    selectedIndexs = flattenTreeIndexs(selected, row, comparefn, selectedIndexs);
    selectedIndexs.forEach(idx => selected.splice(idx, 1, null));
    selected = compact(selected);
  }
  return selected;
}

function flattenTreeIndexs(selected: any[], row: any, comparefn: any, selectedIndexs: any[]) {
  const rowIndex = comparefn(row, selected);
  if (rowIndex > -1) {
    selectedIndexs.push(rowIndex);
  }
  if (row.children && row.children.length > 0) {
    row.children.forEach((childRow: any) => {
      flattenTreeIndexs(selected, childRow, comparefn, selectedIndexs);
    });
  }
  return selectedIndexs;
}

function changeSelectStatusForRow(selected: any[], row: any, selectedIndex: number) {
  if(selectedIndex > -1) {
    selected.splice(selectedIndex, 1);
  } else {
    selected.push(row);
  }
  return selected;
}

export function selectRowsBetween(
  selected: any[],
  rows: any[],
  index: number,
  prevIndex: number,
  comparefn: any): any[] {

  const reverse = index < prevIndex;

  for(let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const greater = i >= prevIndex && i <= index;
    const lesser = i <= prevIndex && i >= index;

    let range = { start: 0, end: 0 };
    if (reverse) {
      range = {
        start: index,
        end: prevIndex
      };
    } else {
      range = {
        start: prevIndex,
        end: index + 1
      };
    }

    if((reverse && lesser) || (!reverse && greater)) {
      // if in the positive range to be added to `selected`, and
      // not already in the selected array, add it
      if(i >= range.start && i <= range.end) {
        selected.push(row);
      }
    }
  }

  return selected;
}
