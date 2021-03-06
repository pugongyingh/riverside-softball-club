const contentMapping = {
  '1H': '1H',
  '2H': '2H',
  '3H': '3H',
  HR: 'HR',
  飛球: 'FO',
  滾地: 'GO',
  BB: 'BB',
  K: 'K',
  E: 'E',
  野選: 'FC',
  犧飛: 'SF',
  雙殺: 'DP',
  三殺: 'TP',
};
const innArray = ['', '一', '二', '三', '四', '五', '六', '七'];

const parseGame = arr => {
  const nameCol = arr[0].indexOf('名單');
  const errCol = arr[0].indexOf('失誤');
  const startCol = arr[0].indexOf('一');
  let row = 1;
  let col = startCol;
  let order = 1;
  let result = [];
  let scan = [];
  let errorArr = [];

  while (col < arr[0].length && row < arr.length) {
    if (scan.indexOf(row + '' + col) === -1) {
      scan.push(row + '' + col);
      if (arr[row][col]) {
        let run = '';
        if (arr[row][col + 2] === 'R') {
          run = arr[row][nameCol];
        } else if (
          row + 1 < arr.length &&
          arr[row + 1][col] === '' &&
          arr[row + 1][col + 2] === 'R'
        ) {
          run = arr[row + 1][nameCol];
        }
        result.push({
          order: order++,
          inn: innArray.indexOf(arr[0][col]),
          name: arr[row][nameCol],
          content: contentMapping[arr[row][col]],
          r: run,
          rbi: arr[row][col + 1],
          _row: row,
        });
      }
    }
    if (arr[row][errCol] && col === startCol) {
      errorArr.push({
        name: arr[row][nameCol],
        count: arr[row][errCol],
      });
    }
    row++;
    if (row === arr.length) {
      if (scan.indexOf('1' + col) === -1) {
        row = 1;
      } else {
        col += 3;
        if (result[result.length - 1]) {
          if (result[result.length - 1]._row === arr.length - 1) {
            row = 1;
          } else {
            row = result[result.length - 1]._row + 1;
          }
        } else {
          row = 1;
        }
      }
    }
  }
  return {
    orders: result.map(item => {
      delete item._row;
      return item;
    }),
    errors: errorArr,
  };
};

const genGameList = games => {
  const temp = games
    .map(item => item.game.substr(0, 8))
    .filter((v, i, self) => self.indexOf(v) === i)
    .sort((a, b) => {
      return (
        parseInt(b.match(/\d/g).join(''), 10) -
        parseInt(a.match(/\d/g).join(''), 10)
      );
    })
    .map(item => {
      return {
        date: item,
        games: games.filter(sub => sub.game.substr(0, 8) === item),
      };
    });
  return temp;
};

function toDataURL(src, callback, outputFormat) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    const canvas = document.createElement('CANVAS');
    const ctx = canvas.getContext('2d');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    callback(canvas.toDataURL(outputFormat));
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    img.src = src;
  }
}
const cache = {};
const cacheImg = url => {
  if (cache[url]) {
    return cache[url];
  } else {
    if (!/\.(gif|jpg|jpeg|tiff|png)$/i.test(url)) {
      toDataURL(url, dataUrl => {
        cache[url] = dataUrl;
      });
    }
    return url;
  }
};

function scrollTo(element) {
  // check is dom node
  if (!!element && element.nodeType === 1) {
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = window.innerHeight * 0.01 * 50;

    window.scrollTo({
      top: Math.max(0, y - yOffset + element.clientHeight / 2),
      behavior: 'smooth',
    });
  }
}

export default {
  parseGame,
  genGameList,
};

export { cacheImg, scrollTo };
