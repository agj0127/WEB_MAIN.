// (1) 마커들을 담을 배열 (기존 장소 검색용 마커를 관리)
var markers = [];

// (2) 지도를 표시할 div와 기본 옵션
var container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
var options = {
  center: new kakao.maps.LatLng(37.379391, 126.928185), // 초기 중심좌표 (예시)
  level: 3 // 확대 레벨 (숫자 작을수록 확대)
};
var map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴


// ▼ [ 추가 ] “클릭한 위치의 주소(도로명/지번) + 지도 중앙 행정동” 기능을 위한 준비

// (3) 주소-좌표 변환(역지오코딩) 객체 생성
var geocoder = new kakao.maps.services.Geocoder();

// (4) 클릭한 위치에 표시할 단일 마커와 인포윈도우 생성
var marker = new kakao.maps.Marker(); // 클릭한 위치에 단일 마커만 띄우기 위해 미리 만들어 둠
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });


// [필수] 페이지 로드 직후: “지도 중앙”의 행정동 주소를 바로 표시

searchAddrFromCoords(map.getCenter(), displayCenterInfo);


// [수정] 기존 click 이벤트 대신 아래 로직을 사용합니다.
// 클릭한 위치의 위/경도 → 역지오코딩 → 도로명/지번 주소 → 인포윈도우

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
  var latlng = mouseEvent.latLng; // 클릭한 좌표

  // 1) “도로명 + 지번” 주소를 역지오코딩으로 얻어 옵니다
  searchDetailAddrFromCoords(latlng, function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      // 도로명 주소가 있는 경우만 따로 분리하여 HTML 문자열 생성
      var roadAddr = result[0].road_address
        ? '<div>도로명주소: ' + result[0].road_address.address_name + '</div>'
        : '';
      var jibunAddr = '<div>지번 주소: ' + result[0].address.address_name + '</div>';

      // 인포윈도우에 들어갈 HTML 콘텐츠
      var content = ''
        + '<div style="padding:5px; line-height:1.4rem;">'
        + '  <span style="font-weight:bold; display:block; margin-bottom:4px;">클릭 위치 주소정보</span>'
        +    roadAddr
        +    jibunAddr
        + '</div>';

      // 2) 마커를 클릭한 위치로 이동 후 지도에 표시
      marker.setPosition(latlng);
      marker.setMap(map);

      // 3) 인포윈도우를 마커 위에 띄워서 주소정보 출력
      infowindow.setContent(content);
      infowindow.open(map, marker);
    } else {
      // 역지오코딩 실패 시: 콘솔에 에러 찍고 마커만 움직여 줍니다.
      console.error('역지오코딩 오류 발생: ' + status);
      marker.setPosition(latlng);
      marker.setMap(map);
    }
  });
});


// [추가] 지도 이동(idle) 이벤트: 중앙 좌표에 대한 “행정동(구/동)”을 표시

kakao.maps.event.addListener(map, 'idle', function() {
  // 지도가 드래그되거나 확대/축소된 직후(center 좌표가 변경된 뒤) 호출됨
  searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

// 좌표 → 행정동(구/동) 정보 요청 함수 (coord2RegionCode 사용)
function searchAddrFromCoords(coords, callback) {
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 좌표 → 도로명/지번 주소 요청 함수 (coord2Address 사용)
function searchDetailAddrFromCoords(coords, callback) {
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// “중앙 좌표의 행정동(구/동)”을 화면에 표시하는 콜백 함수
function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    var centerAddrDiv = document.getElementById('centerAddr');
    // result 배열에는 “시→구→동→법정동” 순서로 여러 항목이 들어옵니다.
    // 그중 region_type이 'H'인 항목을 찾아서 행정동(구/동) 이름을 출력
    for (var i = 0; i < result.length; i++) {
      if (result[i].region_type === 'H') {
        centerAddrDiv.innerHTML = '지도 중앙 행정동: ' + result[i].address_name;
        break;
      }
    }
  } else {
    console.error('coord2RegionCode 에러:', status);
  }
}

// 장소 검색 객체를 생성합니다 (키워드 검색)
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow2 = new kakao.maps.InfoWindow({ zIndex: 1 });

// 페이지 첫 로드시 한 번 검색을 수행합니다 (필요하다면 초기 키워드를 지정하세요)
searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  var keyword = document.getElementById('keyword').value;

  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }

  // 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색 완료시 호출되는 콜백 함수입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면 검색 목록과 마커를 표출합니다
    displayPlaces(data);
    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.');
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 중 오류가 발생했습니다.');
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById('placesList'),
      menuEl = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(),
      bounds = new kakao.maps.LatLngBounds(),
      listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 지도에 마커를 생성하고 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        mkr = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element 생성

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해 LatLngBounds에 좌표를 추가
    bounds.extend(placePosition);

    // 마커, 검색결과 항목에 마우스 오버/아웃 이벤트를 등록합니다
    (function(mkr, title) {
      kakao.maps.event.addListener(mkr, 'mouseover', function() {
        displayInfowindow(mkr, title);
      });
      kakao.maps.event.addListener(mkr, 'mouseout', function() {
        infowindow2.close();
      });
      itemEl.onmouseover = function() {
        displayInfowindow(mkr, title);
      };
      itemEl.onmouseout = function() {
        infowindow2.close();
      };
    })(mkr, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  // 검색 결과 목록 Element에 추가하고, 메뉴 스크롤을 최상단으로
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  map.setBounds(bounds);
}

// 검색 결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

  if (places.road_address_name) {
    itemStr += '    <span>' + places.road_address_name + '</span>' +
               '   <span class="jibun gray">' + places.address_name + '</span>';
  } else {
    itemStr += '    <span>' + places.address_name + '</span>';
  }
  itemStr +=  '<span class="tel">' + places.phone + '</span>' +
              '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  var imageSrc = 
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
      imageSize = new kakao.maps.Size(36, 37),
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
        offset: new kakao.maps.Point(13, 37)
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      mkr = new kakao.maps.Marker({
        position: position,
        image: markerImage
      });

  mkr.setMap(map);
  markers.push(mkr);

  return mkr;
}

// 지도 위에 표시된 기존 마커(검색 결과용)를 모두 제거하는 함수입니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색 결과 목록 하단에 페이지 번호를 표출하는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
      fragment = document.createDocumentFragment(),
      i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement('a');
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = 'on';
    } else {
      el.onclick = (function(i) {
        return function() {
          pagination.gotoPage(i);
        };
      })(i);
    }
    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색 결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다

function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
  infowindow2.setContent(content);
  infowindow2.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}