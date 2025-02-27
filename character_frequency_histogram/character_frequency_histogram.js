/**
 * 이 노드 프로그램은 표준 입력을 받아 그 텍스트에 각 글자가 나타나는 빈도를 계산한 다음 
 * 가장 많이 나타난 글자를 히스토그램으로 표현합니다.
 */

class DefaultMap extends Map {
  constructor(defaultValue) {
    super();
    this.defaultValue = defaultValue; // 기본 값 저장 
  }
  get(key) {
    if (this.has(key)){
      return super.get(key);
    }
    else {
      return this.defaultValue;
    }
  }
}

// 글자 빈도 히스토그램 표시 
class Histogram {
  constructor() {
    this.letterCounts = new DefaultMap(0);  // 글자의 등장 횟수를 저장
    this.totalLetters = 0;  // 전체 글자 수
  }
  // 텍스트를 받아 히스토그램 업데이트 
  add(text) {
    // 텍스트에서 공백을 제거하고 대문자로 변환 
    console.log(`입력된 텍스트 : ${text}`)
    text = text.replace(/[^A-Za-z]/g, "").toUpperCase(); // 영문자만 추출
    // 텍스트의 글자들을 순회
    for (let character of text) {
      let count = this.letterCounts.get(character); // 이전 횟수 가져오기
      this.letterCounts.set(character, count + 1);  // 횟수 증가
      this.totalLetters++;
    }
  }


  // 히스토그램을 ASCII 그래프로 표현
  toString() {
    // 맵을 [key, value] 배열로 변환
    let entries = [...this.letterCounts];

    // 배열을 횟수, 알파벳 순으로 정렬
    entries.sort((a, b) => {
      if (a[1] === b[1]){
        return a[0] < b[0] ? -1 : 1; // 횟수가 같으면 알파벳순으로 정렬 
      }
      else {
        return b[1] - a[1]  // 횟수가 다르면 큰 것이 앞으로 이동 
      }
    })

    // 횟수를 퍼센트로 변환
    for(let entry of entries) {
      entry[1] = entry[1] / this.totalLetters * 100;
  }

    // 1% 미만인 글자는 제거
    entries = entries.filter(entry => entry[1] >= 1);

    // 각 항목을 글자의 나열로 변환
    let lines = entries.map(
      ([l, n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
    )
    
    // 각 행을 줄바꿈 문자로 구분해 병합한 문자열을 반환
    return lines.join("\n");
  }
}


// 히스토그램 객체를 만들고, 표준 입력에서 입력된 텍스트들을 비동기적으로 히스토그램에 추가
// 스트림의 끝에 도달하면 이 히스토그램 반환
async function histogramFromStdin() {
  process.stdin.setEncoding("utf-8");  // 유니코드 문자열로 설정

  let histogram = new Histogram();
  for await (let chunk of process.stdin) {
    histogram.add(chunk)
  
  }
  return histogram;
} 

// // 표준 입력에서 히스토그램 객체를 만들고 히스토그램 출력
histogramFromStdin().then(histogram => {console.log(histogram.toString())});


/**
 * <출처>
 * JavaScript: The Definitive Guide, Seventh Edition, by David Flangan (O'Reilly). Copyright 2020 David Flanagan, 978-1-491-98536-7.
 * 해당 코드는 '자바스크립트 완벽 가이드'에서 제공하는 코드를 바탕으로 작성되었으며, 입력된 텍스트 출력과 알파벳만 추출하는 부분 등을 추가하였습니다.
 */