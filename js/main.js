// 스크롤 애니메이션
document.addEventListener('DOMContentLoaded', () => {
    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 스크롤 시 네비게이션 바 스타일 변경
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backgroundColor = '#fff';
        }
    });

    // 스킬 아이템 애니메이션
    const skillItems = document.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease-out';
        observer.observe(item);
    });

    // 프로젝트 카드 애니메이션
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        projectObserver.observe(card);
    });

    // 타이핑 효과
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        typeWriter();
    }
});

// 기술 스택 아이콘 추가
const skills = [
    { name: 'HTML5', icon: 'fab fa-html5' },
    { name: 'CSS3', icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', icon: 'fab fa-js' },
    { name: 'React', icon: 'fab fa-react' },
    { name: 'Node.js', icon: 'fab fa-node-js' },
    { name: 'Git', icon: 'fab fa-git-alt' }
];

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) {
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <i class="${skill.icon} fa-3x"></i>
            <p>${skill.name}</p>
        `;
        skillsGrid.appendChild(skillElement);
    });
}

// 프로젝트 카드 추가
const projects = [
    {
        title: '지뢰찾기 게임',
        description: 'HTML5, CSS, JavaScript로 만든 클래식 지뢰찾기 게임입니다.',
        image: 'https://via.placeholder.com/300x200',
        link: 'minesweeper.html'
    },
    {
        title: '프로젝트 2',
        description: '프로젝트 설명을 여기에 작성하세요.',
        image: 'https://via.placeholder.com/300x200',
        link: '#'
    },
    {
        title: '프로젝트 3',
        description: '프로젝트 설명을 여기에 작성하세요.',
        image: 'https://via.placeholder.com/300x200',
        link: '#'
    }
];

const projectGrid = document.querySelector('.project-grid');
if (projectGrid) {
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="project-link">자세히 보기</a>
        `;
        projectGrid.appendChild(projectCard);
    });
}

// 연락처 폼 제출 처리
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // 여기에 폼 제출 로직을 추가할 수 있습니다
        alert('메시지가 전송되었습니다!');
        contactForm.reset();
    });
} 