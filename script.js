// =========================================================
// ADMIN CREDENTIALS (front-end demo only)
// =========================================================
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// =========================================================
// DATA: CANDIDATES
// =========================================================
const CANDIDATES = [
  {
    id: 'c1',
    name: 'Hanan Hubi',
    party: 'Progressive Alliance',
    color: 'blue',
    bio: 'Enough delays. Enough excuses. It\'s time for bold decisions, fearless leadership, and a future that works for YOU—not the system.',
    tags: ['Bold Leadership', 'System Change', 'Future First'],
    symbol: '🦅'
  },
  {
    id: 'c2',
    name: 'Danish Ahmad',
    party: 'United People\'s Front',
    color: 'red',
    bio: 'They ignored your voice. I won\'t. I\'m here to challenge power, expose failure, and rebuild a system that finally listens.',
    tags: ['Accountability', 'Power Shift', 'People First'],
    symbol: '⚔️'
  },
  {
    id: 'c3',
    name: 'Shahid Hussain',
    party: 'National Development Party',
    color: 'green',
    bio: 'Former finance secretary focused on economic growth and digital transformation.',
    tags: ['Economy', 'Digital', 'Growth'],
    symbol: '⚡'
  },
  {
    id: 'c4',
    name: 'Furqan Mukhtar',
    party: 'Liberation Front',
    color: 'amber',
    bio: 'We rise together or not at all. I fight for strength, dignity, and a system that protects every citizen.',
    tags: ['Unity', 'Public Welfare', 'Strong Nation'],
    symbol: '🚩'
  },
  {
    id: 'c5',
    name: 'Mujtaba Qayoom',
    party: 'Independent',
    color: '',
    bio: 'Truth over lies. Action over talk. I bring a new era of accountability, clarity, and results that matter.',
    tags: ['Transparency', 'Honest Governance', 'Results Driven'],
    symbol: '🧭'
  }
];

const AVATAR_COLORS = {
  blue: '#1b4f8a', red: '#c0392b', green: '#1a7a4a', amber: '#d35400', '': '#555'
};

const CANDIDATE_CHART_COLORS = [
  '#c9a84c', '#1b4f8a', '#1a7a4a', '#d35400', '#7d6e5b'
];

// =========================================================
// STATE
// =========================================================
let pendingVoteCandidateId = null;
let currentVoter = null;

// =========================================================
// STORAGE HELPERS
// =========================================================
function getVotes() {
  return JSON.parse(localStorage.getItem('vs_votes') || '{}');
}
function saveVotes(v) {
  localStorage.setItem('vs_votes', JSON.stringify(v));
}
function getRegisteredVoters() {
  return JSON.parse(localStorage.getItem('vs_voters') || '[]');
}
function saveVoter(voter) {
  const voters = getRegisteredVoters();
  voters.push(voter);
  localStorage.setItem('vs_voters', JSON.stringify(voters));
}
function hasVoterVoted(voterId) {
  return getVotes().hasOwnProperty(voterId);
}
function castVote(voterId, candidateId) {
  const votes = getVotes();
  votes[voterId] = candidateId;
  saveVotes(votes);
}
function getTotalVotes() {
  return Object.keys(getVotes()).length;
}
function getVoteCounts() {
  const votes = getVotes();
  const counts = {};
  CANDIDATES.forEach(c => counts[c.id] = 0);
  Object.values(votes).forEach(cid => {
    if (counts[cid] !== undefined) counts[cid]++;
  });
  return counts;
}

// =========================================================
// NAVIGATION
// =========================================================
function showPage(pageId) {
  $('.page').removeClass('active');
  $('#page-' + pageId).addClass('active');
  $('.nav-tab:not(#adminNavTab)').removeClass('active');
  $('[data-page="' + pageId + '"]:not(#adminNavTab)').addClass('active');
  updateSteps(pageId);
  if (pageId === 'results') {
    renderResults();
    // Show/hide admin dashboard based on session
    if (isAdminLoggedIn) {
      $('#adminDashboard').addClass('visible');
    } else {
      $('#adminDashboard').removeClass('visible');
    }
  }
  if (pageId === 'home') $('#totalVoters').text(getTotalVotes());
}

function updateSteps(pageId) {
  const map = { register: 1, vote: 2, results: 3, home: 0, 'admin-login': 0 };
  const cur = map[pageId] !== undefined ? map[pageId] : 0;
  for (let i = 1; i <= 3; i++) {
    const $step = $('#step' + i);
    $step.removeClass('active done');
    if (i < cur) { $step.addClass('done'); $step.find('.step-dot').text('✓'); }
    else if (i === cur) { $step.addClass('active'); $step.find('.step-dot').text(i); }
    else { $step.find('.step-dot').text(i); }
    if (i < 3) $('#line' + i).toggleClass('done', i < cur);
  }
}

// Shake keyframe (used by admin login card on wrong password)
(function () {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-6px); }
      80%    { transform: translateX(6px); }
    }`;
  document.head.appendChild(s);
})();

// =========================================================
// TOAST
// =========================================================
let toastTimer;
function showToast(type, title, msg) {
  const $t = $('#toast');
  $t.removeClass('success error')
    .addClass(type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  $('#toastIcon').text(type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ');
  $('#toastTitle').text(title);
  $('#toastMsg').text(msg);
  $t.addClass('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $t.removeClass('show'), 3800);
}

// =========================================================
// VOTER ID INPUT — auto-uppercase
// =========================================================
$('#voterId').on('input', function () {
  let v = $(this).val().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  $(this).val(v);
});

$('#mobile').on('input', function () {
  let v = $(this).val().replace(/\D/g, '').slice(0, 10);
  $(this).val(v);
});

// =========================================================
// REGISTRATION VALIDATION
// =========================================================
function validateAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#])[A-Za-z\d@$#]{9,}$/.test(password);
}

function validateVoterId(id) {
  // Format: exactly 3 uppercase letters + 7 digits = 10 chars
  return /^[A-Z]{3}\d{7}$/.test(id);
}

function clearErrors() {
  $('.field-error').hide();
  $('.field input').removeClass('error');
}

// =========================================================
// REGISTER BUTTON
// =========================================================
$('#registerBtn').on('click', function () {
  clearErrors();
  let valid = true;

  const name    = $('#fullName').val().trim();
  const dob     = $('#dob').val();
  const vidRaw  = $('#voterId').val().trim().toUpperCase();
  const mobile  = $('#mobile').val().trim();
  const email   = $('#email').val().trim();
  const password = $('#password').val();
  const confirmPassword = $('#confirmPassword').val();

  if (!name) {
    $('#err-name').show(); $('#fullName').addClass('error'); valid = false;
  }

  if (!dob || !validateAge(dob)) {
    $('#err-dob').show(); $('#dob').addClass('error'); valid = false;
  }

  if (!validateVoterId(vidRaw)) {
    $('#err-voterId').show(); $('#voterId').addClass('error'); valid = false;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    $('#err-mobile').show(); $('#mobile').addClass('error'); valid = false;
  }

  if (!validateEmail(email)) {
    $('#err-email').show(); $('#email').addClass('error'); valid = false;
  }

  if (!validatePassword(password)) {
    $('#err-password').show();
    $('#password').addClass('error');
    valid = false;
  }

  if (password !== confirmPassword) {
    $('#err-confirmPassword').show();
    $('#confirmPassword').addClass('error');
    valid = false;
  }

  if (!valid) {
    showToast('error', 'Validation Failed', 'Please fix the errors and try again.');
    return;
  }

  const voters = getRegisteredVoters();

  // Voter ID check
  if (voters.some(v => v.voterId === vidRaw)) {
    showToast('error', 'Already Registered', 'This Voter ID is already registered.');
    currentVoter = voters.find(v => v.voterId === vidRaw);
    goToVotePage();
    return;
  }

  // Email check (case-insensitive)
  if (voters.some(v => v.email.toLowerCase() === email.toLowerCase())) {
    $('#email').addClass('error');
    showToast('error', 'Email Already Used', 'This email is already registered.');
    return;
  }

  const voter = {
    name, dob, voterId: vidRaw, mobile, email, password,
    id: 'VTR-' + vidRaw.slice(-6)
  };

  saveVoter(voter);
  currentVoter = voter;

  showToast('success', 'Registration Successful', 'Welcome, ' + name + '! You may now vote.');

  setTimeout(() => goToVotePage(), 800);
});

function goToVotePage() {
  renderCandidates();
  $('#voterNameDisplay').text(currentVoter.name);
  $('#voterIdDisplay').text(currentVoter.voterId);
  showPage('vote');
}

// =========================================================
// RENDER CANDIDATES
// =========================================================
function renderCandidates() {
  const $grid = $('#candidatesGrid');
  $grid.empty();
  const alreadyVoted = hasVoterVoted(currentVoter.voterId);
  const myVote = alreadyVoted ? getVotes()[currentVoter.voterId] : null;

  if (alreadyVoted) {
    const votedFor = CANDIDATES.find(c => c.id === myVote);
    $('#alreadyVotedBanner').show()
      .find('#alreadyVotedText')
      .text('You voted for ' + (votedFor ? votedFor.name : 'a candidate') +
            '. Each voter may only vote once.');
  } else {
    $('#alreadyVotedBanner').hide();
  }

  CANDIDATES.forEach(c => {
    const isVoted    = myVote === c.id;
    const bgColor    = AVATAR_COLORS[c.color] || '#555';
    const tagsHtml   = c.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const btnLabel   = isVoted ? '✓ Your Vote' : alreadyVoted ? 'Voting Closed' : 'Vote';
    const btnDisabled = alreadyVoted ? 'disabled' : '';

    $grid.append(`
      <div class="candidate-card ${isVoted ? 'voted' : ''}" data-id="${c.id}">
        <div class="candidate-banner ${c.color}"></div>
        <div class="candidate-avatar-wrap">
          <div class="candidate-avatar" style="background:${bgColor};">${c.symbol}</div>
        </div>
        <div class="candidate-body">
          <div class="candidate-party">${c.party}</div>
          <div class="candidate-name">${c.name}</div>
          <div class="candidate-bio">${c.bio}</div>
          <div class="candidate-tags">${tagsHtml}</div>
          <button class="vote-btn" data-id="${c.id}" ${btnDisabled}>
            <span>${btnLabel}</span>
          </button>
        </div>
      </div>`);
  });
}

// =========================================================
// VOTING FLOW
// =========================================================
$(document).on('click', '.vote-btn:not(:disabled)', function () {
  const cid = $(this).data('id');
  const candidate = CANDIDATES.find(c => c.id === cid);
  if (!candidate || !currentVoter) return;
  pendingVoteCandidateId = cid;
  $('#modalCandidateName').text(candidate.name);
  $('#modalPartyName').text(candidate.party);
  $('#voteModal').addClass('active');
});

$('#cancelVoteBtn').on('click', function () {
  $('#voteModal').removeClass('active');
  pendingVoteCandidateId = null;
});

$('#confirmVoteBtn').on('click', function () {
  if (!pendingVoteCandidateId || !currentVoter) return;
  if (hasVoterVoted(currentVoter.voterId)) {
    showToast('error', 'Duplicate Vote', 'You have already cast your vote.');
    $('#voteModal').removeClass('active');
    return;
  }
  castVote(currentVoter.voterId, pendingVoteCandidateId);
  playVoteSound();
  $('#voteModal').removeClass('active');
  const candidate = CANDIDATES.find(c => c.id === pendingVoteCandidateId);
  showToast('success', 'Vote Cast!', 'Your vote for ' + candidate.name + ' has been recorded.');
  renderCandidates();
  pendingVoteCandidateId = null;
});

$('#voteModal').on('click', function (e) {
  if ($(e.target).is('#voteModal')) $('#voteModal').removeClass('active');
});

// =========================================================
// ADMIN SESSION MANAGEMENT
// =========================================================
let isAdminLoggedIn = false;

function setAdminSession(loggedIn) {
  isAdminLoggedIn = loggedIn;
  if (loggedIn) {
    $('#adminSessionPill').addClass('visible');
    $('#adminDashboard').addClass('visible');
    // Change Admin nav tab label to indicate active session
    $('#adminNavTab').html('🔴 Logout Admin').css('color', '#e88');
  } else {
    $('#adminSessionPill').removeClass('visible');
    $('#adminDashboard').removeClass('visible');
    $('#adminNavTab').html('🔐 Admin').css('color', '#c0694a');
  }
}

// Admin Login Page — authenticate
$('#adminLoginBtn').on('click', function () {
  const user = $('#adminLoginUser').val().trim();
  const pass = $('#adminLoginPass').val();
  $('#adminLoginErr').hide();

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    $('#adminLoginErr').show();
    $('#adminLoginPass').val('');
    // Shake the card
    const $card = $('.admin-login-card');
    $card.css('animation', 'none');
    setTimeout(() => { $card.css('animation', 'shake 0.4s ease'); }, 10);
    return;
  }

  // Success — start admin session
  setAdminSession(true);
  $('#adminLoginUser').val('');
  $('#adminLoginPass').val('');
  showToast('success', 'Admin Access Granted', 'Welcome, Administrator. Reset controls are now visible.');
  showPage('results');
});

// Enter key support on admin login page
$('#adminLoginUser, #adminLoginPass').on('keydown', function (e) {
  if (e.key === 'Enter') $('#adminLoginBtn').trigger('click');
});

// Admin nav tab — if already logged in, clicking logs out; otherwise goes to login page
$('#adminNavTab').on('click', function () {
  if (isAdminLoggedIn) {
    setAdminSession(false);
    showToast('', 'Admin Logged Out', 'Admin session ended. Reset controls are hidden.');
    showPage('results');
  } else {
    // Clear login fields and error
    $('#adminLoginUser').val('');
    $('#adminLoginPass').val('');
    $('#adminLoginErr').hide();
    showPage('admin-login');
    // Update step bar to not highlight anything for admin page
    updateSteps('admin-login');
  }
});

// Admin session pill click = logout
$('#adminSessionPill').on('click', function () {
  setAdminSession(false);
  showToast('', 'Admin Logged Out', 'Admin session ended. Reset controls are hidden.');
  showPage('results');
});

// Reset election button (only reachable when admin dashboard is visible)
$('#resetElectionBtn').on('click', function () {
  if (!isAdminLoggedIn) return; // hard guard — should never reach here otherwise
  if (!confirm('⚠️ This will permanently erase ALL votes and ALL voter registrations.\n\nThis action cannot be undone. Continue?')) return;

  localStorage.removeItem('vs_votes');
  localStorage.removeItem('vs_voters');
  currentVoter = null;
  renderResults();
  showToast('success', 'Election Reset', 'All votes and voter records have been cleared by admin.');
});

// =========================================================
// UNIQUE ELEMENT: LIVE TURNOUT DONUT CHART
// =========================================================
const CIRCUMFERENCE = 2 * Math.PI * 51; // r=51

function renderDonutChart(voted, registered) {
  const total = registered;
  const notVoted = Math.max(0, total - voted);
  const pct = total > 0 ? Math.round((voted / total) * 100) : 0;

  $('#donutPct').text(pct + '%');
  $('#legendVoted').text(voted);
  $('#legendRegistered').text(total);
  $('#legendPending').text(notVoted);

  if (total === 0) {
    $('#donutVoted').attr('stroke-dasharray', '0 ' + CIRCUMFERENCE);
    $('#donutRegistered').attr('stroke-dasharray', '0 ' + CIRCUMFERENCE);
    return;
  }

  const votedLen = (voted / total) * CIRCUMFERENCE;
  const regLen   = (notVoted / total) * CIRCUMFERENCE;

  // Voted arc starts at 0
  $('#donutVoted').attr({
    'stroke-dasharray': votedLen + ' ' + (CIRCUMFERENCE - votedLen),
    'stroke-dashoffset': 0
  });

  // Registered-not-voted arc starts after the voted arc
  $('#donutRegistered').attr({
    'stroke-dasharray': regLen + ' ' + (CIRCUMFERENCE - regLen),
    'stroke-dashoffset': -votedLen
  });
}

function renderBarChart(counts, total) {
  const $list = $('#barChartList');
  $list.empty();
  const sorted = [...CANDIDATES].sort((a, b) => counts[b.id] - counts[a.id]);
  sorted.forEach((c, i) => {
    const cnt = counts[c.id];
    const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
    const color = CANDIDATE_CHART_COLORS[i] || '#999';
    $list.append(`
      <li class="bar-chart-item">
        <div class="bar-chart-top">
          <span class="bar-chart-name">${c.name}</span>
          <span class="bar-chart-count">${cnt} vote${cnt !== 1 ? 's' : ''} · ${pct}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" data-pct="${pct}" style="background:${color};width:0%;"></div>
        </div>
      </li>`);
  });
  setTimeout(() => {
    $list.find('.bar-fill').each(function () {
      $(this).css('width', $(this).data('pct') + '%');
    });
  }, 120);
}

// =========================================================
// RESULTS
// =========================================================
function renderResults() {
  const counts  = getVoteCounts();
  const total   = Object.values(counts).reduce((a, b) => a + b, 0);
  const regCount = getRegisteredVoters().length;

  $('#resultTotal').text(total);
  $('#totalVoters').text(total);

  // Donut + bar chart
  renderDonutChart(total, regCount);
  renderBarChart(counts, total);

  const sorted = [...CANDIDATES].sort((a, b) => counts[b.id] - counts[a.id]);
  const winner = sorted[0];

  if (total === 0) {
    $('#winnerName').text('No votes cast yet');
    $('#winnerVotes').text('');
  } else {
    $('#winnerName').text(winner.name);
    $('#winnerVotes').text(counts[winner.id] + ' votes — ' + winner.party);
  }

  const $list = $('#resultsList');
  $list.empty();

  sorted.forEach((c, i) => {
    const cnt = counts[c.id];
    const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
    const isLeader = i === 0 && total > 0;
    const bgColor  = AVATAR_COLORS[c.color] || '#555';

    $list.append(`
      <div class="result-row ${isLeader ? 'leader' : ''}">
        <div class="result-rank">${i + 1}</div>
        <div style="width:40px;height:40px;border-radius:50%;background:${bgColor};
             display:flex;align-items:center;justify-content:center;
             font-family:var(--font-head);font-size:0.85rem;color:white;flex-shrink:0;">
          ${c.symbol}
        </div>
        <div class="result-info">
          <div class="result-name">${c.name}</div>
          <div class="result-party">${c.party}</div>
        </div>
        <div class="result-bar-wrap">
          <div class="result-bar-bg">
            <div class="result-bar-fill" data-pct="${pct}" style="width:0%"></div>
          </div>
          <div class="result-pct">${pct}%</div>
        </div>
        <div class="result-votes-num">${cnt}</div>
      </div>`);
  });

  setTimeout(() => {
    $('.result-bar-fill').each(function () {
      $(this).css('width', $(this).data('pct') + '%');
    });
  }, 100);
}

// =========================================================
// CONTROLS
// =========================================================
$('#startBtn').on('click', function () { showPage('register'); });

$('.nav-tab:not(#adminNavTab)').on('click', function () {
  const page = $(this).data('page');
  if (page === 'vote' && !currentVoter) {
    showToast('error', 'Not Registered', 'Please register before voting.');
    showPage('register');
    return;
  }
  if (page === 'vote') renderCandidates();
  showPage(page);
});

$('#refreshResultsBtn').on('click', function () {
  renderResults();
  showToast('', 'Results Updated', 'Live tally has been refreshed.');
});

// =========================================================
// INIT
// =========================================================
$(function () {
  $('#totalVoters').text(getTotalVotes());
  updateSteps('register');
  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 18);
  $('#dob').attr('max', maxDob.toISOString().split('T')[0]);
});

// Function to play a confirmation "ping" sound when a vote is successfully cast
function playVoteSound() {
  const sound = document.getElementById("voteSound");
  if (sound) {
    sound.currentTime = 0; 
    sound.play().catch(() => {}); 
  }
}