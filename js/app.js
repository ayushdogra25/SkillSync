
// Task Management
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskList = document.getElementById('task-list');
    const categoryFilter = document.getElementById('task-category').value;
    const priorityFilter = document.getElementById('task-priority').value;
    const searchText = document.getElementById('task-search').value.toLowerCase();
    
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        return matchesCategory && matchesPriority && matchesSearch;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <span class="task-category" style="background-color: ${getPriorityColor(task.priority)}; color: white; padding: 0.25rem 0.5rem; border-radius: 15px;">
                ${task.priority}
            </span>
            <span class="task-category" style="background-color: ${getCategoryColor(task.category)}; color: white; padding: 0.25rem 0.5rem; border-radius: 15px;">
                ${task.category}
            </span>
            <button class="delete-task" data-index="${index}">🗑️</button>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const categorySelect = document.getElementById('task-category-select');
    const prioritySelect = document.getElementById('task-priority-select');
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    
    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push({ 
            text: taskText, 
            category: category,
            priority: priority,
            completed: false,
            timestamp: Date.now()
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        categorySelect.value = '';
        prioritySelect.value = 'low';
        loadTasks();
    }
}

function toggleTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Skill Management
function loadSkills() {
    const skills = JSON.parse(localStorage.getItem('skills') || '[]');
    const searchText = document.getElementById('skill-search').value.toLowerCase();
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchText);
        return matchesSearch;
    });

    filteredSkills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <span class="skill-name">${skill.name}</span>
            <span class="skill-category" style="background-color: ${getCategoryColor(skill.category)}; color: white; padding: 0.25rem 0.5rem; border-radius: 15px;">
                ${skill.category}
            </span>
            <div class="skill-progress">
                <div class="progress-bar" style="width: ${getLevelWidth(skill.level)}%;">
                    <span class="progress-text">${skill.level}</span>
                </div>
            </div>
            <button class="delete-skill" data-index="${skills.indexOf(skill)}">🗑️</button>
        `;
        skillsContainer.appendChild(skillElement);
    });

    updateStats();
}

function addSkill() {
    const nameInput = document.getElementById('new-skill');
    const categorySelect = document.getElementById('skill-category');
    const levelSelect = document.getElementById('skill-level');
    const skillName = nameInput.value.trim();
    const skillCategory = categorySelect.value;
    const skillLevel = levelSelect.value;
    
    if (skillName) {
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        skills.push({ 
            name: skillName, 
            category: skillCategory,
            level: skillLevel,
            progress: 0,
            timestamp: Date.now()
        });
        localStorage.setItem('skills', JSON.stringify(skills));
        nameInput.value = '';
        categorySelect.value = '';
        levelSelect.value = 'beginner';
        loadSkills();
    }
}

function deleteSkill(index) {
    const skills = JSON.parse(localStorage.getItem('skills') || '[]');
    skills.splice(index, 1);
    localStorage.setItem('skills', JSON.stringify(skills));
    loadSkills();
}

// Helper Functions
function getPriorityColor(priority) {
    const colors = {
        low: '#4CAF50',
        medium: '#FFA500',
        high: '#FF4444'
    };
    return colors[priority] || '#4CAF50';
}

function getCategoryColor(category) {
    const colors = {
        programming: '#61dafb',
        design: '#ff6b6b',
        business: '#4ecdc4',
        soft: '#9b59b6'
    };
    return colors[category] || '#61dafb';
}

function getLevelWidth(level) {
    const levels = {
        beginner: 25,
        intermediate: 50,
        advanced: 75,
        expert: 100
    };
    return levels[level] || 25;
}

function updateStats() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const skills = JSON.parse(localStorage.getItem('skills') || '[]');
    
    // Task Stats
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('completed-tasks').textContent = tasks.filter(t => t.completed).length;
    
    // Skill Stats
    const totalSkills = skills.length;
    const totalProgress = skills.reduce((sum, skill) => sum + getLevelWidth(skill.level), 0);
    const averageProgress = totalSkills ? (totalProgress / totalSkills).toFixed(0) : 0;
    document.getElementById('skill-progress').textContent = averageProgress;
    
    // Streak
    const today = new Date().setHours(0,0,0,0);
    const streak = tasks.filter(t => new Date(t.timestamp).setHours(0,0,0,0) === today).length;
    document.getElementById('streak').textContent = streak;
}

// Event Listeners
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('add-skill').addEventListener('click', addSkill);
document.getElementById('new-skill').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSkill();
});

document.getElementById('task-category').addEventListener('change', loadTasks);
document.getElementById('task-priority').addEventListener('change', loadTasks);
document.getElementById('task-search').addEventListener('input', loadTasks);
document.getElementById('skill-search').addEventListener('input', loadSkills);

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        deleteTask(index);
    }
    if (e.target.classList.contains('delete-skill')) {
        const index = e.target.dataset.index;
        deleteSkill(index);
    }
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.dataset.index;
        toggleTask(index);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadSkills();
    updateStats();
});

// Event Listeners
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('new-skill').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSkill();
});
document.getElementById('skill-level').addEventListener('change', addSkill);

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        deleteTask(index);
    }
    if (e.target.classList.contains('delete-skill')) {
        const index = e.target.dataset.index;
        deleteSkill(index);
    }
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.dataset.index;
        toggleTask(index);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadSkills();
});

// Sidebar Management
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('sidebar-collapsed');
    mainContent.classList.toggle('main-content-collapsed');
}

// Time Greeting and Clock
function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

function getPersonalizedGreeting() {
    const savedName = localStorage.getItem('userName');
    const greeting = getTimeGreeting();
    return savedName ? `${greeting}, ${savedName}!` : greeting;
}

function initializeClock() {
    const clockElement = document.querySelector('.clock');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// Handle user name input
function handleUserNameInput() {
    const userNameInput = document.getElementById('user-name-input');
    const userNameDisplay = document.getElementById('user-name');
    const nameInputContainer = document.getElementById('name-input-container');
    const saveNameButton = document.getElementById('save-name');

    // Check if user has already entered a name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userNameDisplay.textContent = savedName;
        return;
    }

    // Show name input container
    nameInputContainer.classList.add('show');

    // Focus on input when shown
    userNameInput.focus();

    // Handle save button click
    saveNameButton.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (name) {
            userNameDisplay.textContent = name;
            localStorage.setItem('userName', name);
            nameInputContainer.classList.remove('show');
        }
    });

    // Handle Enter key press
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveNameButton.click();
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    handleUserNameInput();
    document.querySelector('.greeting').textContent = getPersonalizedGreeting();
    setInterval(updateClock, 1000);
    updateClock();
    document.querySelector('.timer').textContent = formatTime(pomodoroTime);
    updateStats();
    loadTasks();
    loadSkills();
    initSectionNavigation();

    document.querySelector('.theme-switch').addEventListener('change', e => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    document.querySelector('.start').addEventListener('click', startTimer);
let timerInterval;
let timerStartTime;

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    // Get saved timer state
    const savedTime = localStorage.getItem('timerTime');
    
    // Initialize timer
    timerStartTime = savedTime ? parseInt(savedTime) : Date.now();
    
    // Start updating timer
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - timerStartTime) / 1000);
        document.querySelector('.timer').textContent = formatTime(elapsedSeconds);
    }, 1000);
}

// Save timer state on page unload
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        localStorage.setItem('timerTime', timerStartTime);
    }
});

// Handle user name input
function handleUserNameInput() {
    const userNameDisplay = document.getElementById('user-name');
    const savedName = localStorage.getItem('userName');
    
    // Update display if name is saved
    if (savedName) {
        userNameDisplay.textContent = savedName;
        return;
    }

    // Ask for name if not saved
    const name = prompt('Welcome! What is your name?');
    if (name && name.trim()) {
        const trimmedName = name.trim();
        localStorage.setItem('userName', trimmedName);
        userNameDisplay.textContent = trimmedName;
        
        // Update greeting text
        const greetingText = document.getElementById('greeting-text');
        if (greetingText) {
            greetingText.textContent = `Welcome back, ${trimmedName}!`;
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Start timer
    startTimer();
    
    // Handle user name
    handleUserNameInput();
    
    initializeClock();
    document.querySelector('.greeting').textContent = getPersonalizedGreeting();
    updateStats();
    loadTasks();
    loadSkills();
    initSectionNavigation();

    document.querySelector('.theme-switch').addEventListener('change', e => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    document.querySelector('.start').addEventListener('click', startTimer);
    document.querySelector('.pause').addEventListener('click', pauseTimer);
    document.querySelector('.reset').addEventListener('click', resetTimer);

    document.getElementById('add-task').addEventListener('click', () => {
        const taskInput = document.getElementById('new-task');
        if (taskInput.value.trim()) {
            addTaskToDOM(taskInput.value);
            taskInput.value = '';
            saveTasks();
        }
    });

    document.getElementById('add-skill').addEventListener('click', () => {
        const skillInput = document.getElementById('new-skill');
        const levelSelect = document.getElementById('skill-level');
        if (skillInput.value.trim()) {
            addSkillToDOM(skillInput.value, levelSelect.value);
            saveSkills();
            skillInput.value = '';
        }
    });

    if (!localStorage.getItem('userName')) {
        const name = prompt('Welcome! What is your name?');
        if (name && name.trim()) {
            localStorage.setItem('userName', name.trim());
            document.querySelector('.greeting').textContent = getPersonalizedGreeting();
        }
    }
});

// Skill Tracker
function loadSkills() {
    const skills = JSON.parse(localStorage.getItem('skills') || '[]');
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    skills.forEach(skill => addSkillToDOM(skill.name, skill.level));
    updateStats();
}

function addSkillToDOM(name, level) {
    const skillsContainer = document.getElementById('skills-container');
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    const progress = level === 'beginner' ? 30 : level === 'intermediate' ? 60 : 100;
    const color = level === 'beginner' ? '#f39c12' : level === 'intermediate' ? '#2ecc71' : '#3498db';

    skillCard.innerHTML = `
        <div class="skill-name">${name}</div>
        <div class="skill-progress">
            <div class="skill-bar" style="width: ${progress}%; background-color: ${color};"></div>
        </div>
        <div class="skill-level">${level.charAt(0).toUpperCase() + level.slice(1)}</div>
        <button class="delete-skill">🗑️</button>
    `;

    skillCard.querySelector('.delete-skill').addEventListener('click', () => {
        skillCard.remove();
        saveSkills();
    });

    skillsContainer.appendChild(skillCard);
}

function saveSkills() {
    const skills = Array.from(document.querySelectorAll('.skill-card')).map(skill => ({
        name: skill.querySelector('.skill-name').textContent,
        level: skill.querySelector('.skill-level').textContent.toLowerCase()
    }));
    localStorage.setItem('skills', JSON.stringify(skills));
    updateStats();
}

// Stats
function updateStats() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const completedTasks = tasks.filter(task => task.completed).length;
    document.getElementById('completed-tasks').textContent = completedTasks;

    const hoursFocused = Math.floor((completedTasks * 25) / 60);
    document.getElementById('pomodoro-hours').textContent = hoursFocused;

    const skills = JSON.parse(localStorage.getItem('skills') || '[]');
    document.getElementById('skills-added').textContent = skills.length;
}

// Section Navigation
function initSectionNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.style.display = 'block';
            }
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });

    // Set initial active section
    const initialSection = localStorage.getItem('activeSection') || 'home';
    const initialNavItem = document.querySelector(`[data-section="${initialSection}"]`);
    if (initialNavItem) {
        initialNavItem.click();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const currentSection = document.querySelector('.section[style*="display: block"]');
        if (currentSection) {
            const sectionId = currentSection.id;
            const navItem = document.querySelector(`[data-section="${sectionId}"]`);
            if (navItem) {
                navItem.click();
            }
        }
    });
}
