// 캔버스 요소와 그리기 context 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상수들
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_COLOR = '#00f';
const PLAYER_SPEED = 8; // 플레이어 속도를 8로 증가
const BULLET_SPEED = 8;
const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 50;
let enemyColor = '#f0f';
const ENEMY_SPEED = 2;

// 플레이어 객체
let player = {
  x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
  y: GAME_HEIGHT - 50,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  color: PLAYER_COLOR,
  speed: PLAYER_SPEED
};

// 총알 객체 배열
let bullets = [];

// 적 객체 배열
let enemies = [];

// 점수 변수
let score = 0;

// 플레이어 이동 함수
function movePlayer(dir) {
  if (dir === 'left' && player.x > 0) {
    player.x -= player.speed;
  } else if (dir === 'right' && player.x < GAME_WIDTH - player.width) {
    player.x += player.speed;
  }
}

// 총알 추가 함수
function addBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 1.5, // 총알 중앙 정렬을 위한 조정
    y: player.y,
    width: 15,
    height: 25,
    color: '#f00',
    speed: BULLET_SPEED
  });
}

// 적 생성 함수
function createEnemy() {
  const enemyX = Math.random() * (GAME_WIDTH - ENEMY_WIDTH);
  const enemyY = -ENEMY_HEIGHT;

  enemies.push({
    x: enemyX,
    y: enemyY,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    color: enemyColor,
    speed: ENEMY_SPEED
  });
}

// 3초마다 적 생성하기
setInterval(createEnemy, 3000);

// 점수 출력 함수
function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// 게임 루프 함수
function gameLoop() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 플레이어 그리기
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 적 그리기 및 이동
  enemies.forEach((enemy, eIndex) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    enemy.y += enemy.speed;

    // 적이 화면을 벗어나면 게임 오버
    if (enemy.y > GAME_HEIGHT) {
      restartGame(); // 게임 오버 처리
    }

    // 총알과 적 충돌 체크
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // 충돌 시 총알과 적 제거, 점수 추가
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score += 10;

        // 점수가 100 단위로 증가할 때마다 적의 색상 변경
        if (score % 100 === 0 && score !== 0) {
          enemyColor = (enemyColor === '#f0f') ? '#f00' : '#00f';
        }
      }
    });

    // 적과 플레이어 충돌 체크
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // 충돌 시 게임 종료 및 재시작
      restartGame();
    }
  });

  // 총알 그리기 및 이동
  bullets.forEach((bullet, bIndex) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    bullet.y -= bullet.speed;

    // 총알이 화면을 벗어나면 제거
    if (bullet.y < 0) {
      bullets.splice(bIndex, 1);
    }
  });

  // 점수 출력
  drawScore();

  requestAnimationFrame(gameLoop);
}

// 게임 시작 함수
function startGame() {
  // 초기화
  enemies = [];
  score = 0;
  enemyColor = '#f0f';

  // 플레이어 위치 초기화
  player.x = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
  player.y = GAME_HEIGHT - 50;

  // 게임 루프 시작
  gameLoop();
}

// 게임 재시작 함수
function restartGame() {
  // 게임 종료 처리
  alert('게임 오버!');

  // 새로운 게임 시작
  startGame();
}

// 키보드 이벤트 리스너 추가
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    movePlayer('left');
  } else if (e.key === 'ArrowRight') {
    movePlayer('right');
  } else if (e.key === ' ') {
    addBullet();
  }
});

// 게임 시작
startGame();
