class JobAnalyzer {
  constructor() {
    // Wait for DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
    this.regions = {
      'moscow': 'Москва',
      'spb': 'Санкт-Петербург',
      'novosibirsk': 'Новосибирск',
      'ekaterinburg': 'Екатеринбург',
      'kazan': 'Казань',
      'vladivostok': 'Владивосток',
      'krasnodar': 'Краснодар',
      'remote': 'Удаленная работа'
    };
    this.skillsHistory = this.generateSkillsHistoryData();
  }

  init() {
    this.initializeElements();
    this.initializeCharts();
    this.addEventListeners();
    this.mockData = this.generateMockData();
    this.detailedData = this.generateDetailedData();
    this.topJobsData = this.generateTopJobsData();
    this.salaryTrendsData = this.generateSalaryTrendsData();
    this.regionalData = this.generateRegionalData();
    this.initializeSkillsAnalysisCharts();
    this.updateData();
    this.updateTopJobs();
    this.updateSalaryTrends();
    this.updateRegionalAnalysis();
  }

  initializeElements() {
    this.salaryMin = document.getElementById('salaryMin');
    this.salaryMax = document.getElementById('salaryMax');
    this.updateButton = document.getElementById('updateData');
    this.requirementsList = document.getElementById('requirementsList');
    this.showDetailedSkillsButton = document.getElementById('showDetailedSkills');
    this.detailedAnalysis = document.getElementById('detailedAnalysis');
    this.coreTechnologies = document.getElementById('coreTechnologies');
    this.tools = document.getElementById('tools');
    this.methodologies = document.getElementById('methodologies');
    this.topJobsList = document.getElementById('topJobsList');
    this.topJobsChart = document.getElementById('topJobsChart');
    this.salaryTrendsChart = document.getElementById('salaryTrendsChart');
    this.regionalAnalysisChart = document.getElementById('regionalAnalysisChart');
    this.regionalDemandChart = document.getElementById('regionalDemandChart');
  }

  initializeCharts() {
    // Skills Chart
    const skillsCanvas = document.getElementById('skillsChart');
    if (!skillsCanvas) {
      console.error('Skills chart canvas not found');
      return;
    }

    this.skillsChart = new Chart(skillsCanvas, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Частота упоминания',
          data: [],
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Salary Chart
    const salaryCanvas = document.getElementById('salaryChart');
    if (!salaryCanvas) {
      console.error('Salary chart canvas not found');
      return;
    }

    this.salaryChart = new Chart(salaryCanvas, {
      type: 'bar',
      data: {
        labels: [], 
        datasets: [{
          label: 'Средняя зарплата (тыс. ₽)',
          data: [],
          backgroundColor: '#2ecc71'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Top Jobs Chart
    const topJobsCanvas = document.getElementById('topJobsChart');
    if (!topJobsCanvas) {
      console.error('Top jobs chart canvas not found');
      return;
    }

    this.topJobsSalaryChart = new Chart(topJobsCanvas, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Средняя зарплата (тыс. ₽)',
          data: [],
          backgroundColor: '#9b59b6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });

    // Salary Trends Chart
    const salaryTrendsCanvas = document.getElementById('salaryTrendsChart');
    if (!salaryTrendsCanvas) {
      console.error('Salary trends chart canvas not found');
      return;
    }

    this.salaryTrendsLineChart = new Chart(salaryTrendsCanvas, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024 (прогноз)', '2025 (прогноз)'],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Зарплата (тыс. ₽)'
            }
          }
        }
      }
    });

    // Demand Chart
    const demandCanvas = document.getElementById('demandChart');
    if (demandCanvas) {
      this.demandChart = new Chart(demandCanvas, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Востребованность на рынке (%)',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Востребованность: ${context.raw}%`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
  }

  initializeSkillsAnalysisCharts() {
    // Current Skills Distribution Chart
    const currentSkillsCanvas = document.getElementById('currentSkillsChart');
    if (currentSkillsCanvas) {
      this.currentSkillsChart = new Chart(currentSkillsCanvas, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Востребованность навыка (%)',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // Skills Trends Chart
    const skillsTrendsCanvas = document.getElementById('skillsTrendsChart');
    if (skillsTrendsCanvas) {
      this.skillsTrendsChart = new Chart(skillsTrendsCanvas, {
        type: 'line',
        data: {
          labels: this.skillsHistory.months,
          datasets: []
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              align: 'start'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Востребованность (%)'
              }
            }
          }
        }
      });
    }
  }

  addEventListeners() {
    this.updateButton.addEventListener('click', () => this.updateData());
    this.showDetailedSkillsButton.addEventListener('click', () => this.toggleDetailedAnalysis());
    
    // Add listeners for salary inputs
    this.salaryMin.addEventListener('change', () => this.updateData());
    this.salaryMax.addEventListener('change', () => this.updateData());
  }

  generateSalaryData(position, avgSalary) {
    const salaryModifiers = {
      'devops': 1.2,
      'sysadmin': 0.9,
      'network': 1.0,
      'backend': 1.15,
      'frontend': 1.1,
      'fullstack': 1.25,
      'data_engineer': 1.3,
      'data_scientist': 1.35,
      'qa': 0.95,
      'security': 1.3,
      'dba': 1.1,
      'mobile': 1.2
    };

    return avgSalary * (salaryModifiers[position] || 1);
  }

  generateDemandData() {
    const demandData = {
      'devops': { demand: 95, trend: 'rising' },
      'data_scientist': { demand: 92, trend: 'rising' },
      'security': { demand: 90, trend: 'rising' },
      'data_engineer': { demand: 88, trend: 'rising' },
      'fullstack': { demand: 85, trend: 'stable' },
      'backend': { demand: 82, trend: 'stable' },
      'frontend': { demand: 80, trend: 'stable' },
      'mobile': { demand: 78, trend: 'rising' },
      'dba': { demand: 75, trend: 'stable' },
      'network': { demand: 72, trend: 'declining' },
      'qa': { demand: 70, trend: 'stable' },
      'sysadmin': { demand: 65, trend: 'declining' }
    };

    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);

    const filteredData = {};
    selectedPositions.forEach(pos => {
      if (demandData[pos]) {
        filteredData[pos] = demandData[pos];
      }
    });

    return filteredData;
  }

  generateMockData() {
    const minSalary = parseInt(this.salaryMin.value) || 180000;
    const maxSalary = parseInt(this.salaryMax.value) || 220000;
    const avgSalary = (minSalary + maxSalary) / 2;
    
    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);

    const salaries = {};
    selectedPositions.forEach(position => {
      salaries[position] = this.generateSalaryData(position, avgSalary);
    });

    this.salaryChart.data.labels = selectedPositions.map(position => {
      const labels = {
        'devops': 'DevOps',
        'sysadmin': 'Системное администрирование',
        'network': 'Сетевой инженер',
        'backend': 'Backend разработчик',
        'frontend': 'Frontend разработчик',
        'fullstack': 'Fullstack разработчик',
        'data_engineer': 'Data Engineer',
        'data_scientist': 'Data Scientist',
        'qa': 'QA инженер',
        'security': 'IT Security',
        'dba': 'Database Administrator',
        'mobile': 'Mobile разработчик'
      };
      return labels[position];
    });

    let skills = {};
    // Generate skills based on selected positions
    selectedPositions.forEach(position => {
      switch(position) {
        case 'devops':
          skills = {...skills, 
            'Docker': 85,
            'Kubernetes': 80,
            'CI/CD': 75,
            'Ansible': 70,
            'Cloud (AWS/GCP)': 75
          };
          break;
        case 'sysadmin':
          skills = {...skills,
            'Linux': 90,
            'Windows Server': 85,
            'Active Directory': 80,
            'Virtualization': 75,
            'Backup Systems': 70
          };
          break;
        case 'network':
          skills = {...skills,
            'Cisco': 85,
            'Network Security': 80,
            'Routing & Switching': 85,
            'VPN': 75,
            'SDN': 70
          };
          break;
        case 'backend':
          skills = {...skills,
            'Python': 85,
            'Java': 80,
            'Databases': 85,
            'REST API': 80,
            'Node.js': 75
          };
          break;
        case 'frontend':
          skills = {...skills,
            'JavaScript': 90,
            'React': 85,
            'HTML/CSS': 90,
            'TypeScript': 80,
            'Vue.js': 75
          };
          break;
        case 'fullstack':
          skills = {...skills,
            'JavaScript': 85,
            'Node.js': 80,
            'React': 80,
            'SQL': 75,
            'DevOps basics': 70
          };
          break;
        case 'data_engineer':
          skills = {...skills,
            'Python': 85,
            'SQL': 90,
            'ETL': 85,
            'Big Data': 80,
            'Data Warehousing': 75
          };
          break;
        case 'data_scientist':
          skills = {...skills,
            'Python': 90,
            'Machine Learning': 85,
            'Statistics': 85,
            'Deep Learning': 80,
            'Data Visualization': 75
          };
          break;
        case 'qa':
          skills = {...skills,
            'Test Automation': 85,
            'Selenium': 80,
            'API Testing': 75,
            'Python/Java': 70,
            'Test Planning': 85
          };
          break;
        case 'security':
          skills = {...skills,
            'Network Security': 90,
            'Penetration Testing': 85,
            'Security Tools': 80,
            'Risk Assessment': 75,
            'SIEM': 70
          };
          break;
        case 'dba':
          skills = {...skills,
            'SQL': 90,
            'Database Design': 85,
            'Performance Tuning': 80,
            'Backup/Recovery': 85,
            'NoSQL': 75
          };
          break;
        case 'mobile':
          skills = {...skills,
            'Swift/Kotlin': 85,
            'Mobile UI/UX': 80,
            'React Native': 75,
            'Mobile Security': 70,
            'API Integration': 85
          };
          break;
      }
    });

    // Adjust skills based on salary range
    if (avgSalary < 150000) {
      Object.keys(skills).forEach(skill => {
        skills[skill] = Math.max(40, skills[skill] - 20);
      });
    } else if (avgSalary > 250000) {
      Object.keys(skills).forEach(skill => {
        skills[skill] = Math.min(100, skills[skill] + 10);
      });
    }
    
    this.salaryChart.data.datasets[0].data = Object.values(salaries);

    return {
      skills,
      salaries,
      requirements: this.generatePositionRequirements(selectedPositions, minSalary, maxSalary)
    };
  }

  generatePositionRequirements(selectedPositions, minSalary, maxSalary) {
    const requirements = [];
    
    selectedPositions.forEach(position => {
      switch(position) {
        case 'devops':
          requirements.push({
            position: 'DevOps инженер',
            company: 'Tech Solutions',
            salary: `${minSalary}-${maxSalary}`,
            requirements: [
              'Docker, Kubernetes',
              'CI/CD (Jenkins, GitLab)',
              'Linux администрирование',
              'Мониторинг систем',
              'Python скриптинг'
            ]
          });
          break;
        case 'sysadmin':
          requirements.push({
            position: 'Системный администратор',
            company: 'Digital Corp',
            salary: `${minSalary-20000}-${maxSalary-10000}`,
            requirements: [
              'Linux/Windows Server',
              'Виртуализация (VMware)',
              'Сетевое администрирование',
              'Резервное копирование',
              'Управление безопасностью'
            ]
          });
          break;
        case 'network':
          requirements.push({
            position: 'Сетевой инженер',
            company: 'Network Pro',
            salary: `${minSalary+10000}-${maxSalary+20000}`,
            requirements: [
              'Cisco сети',
              'Сетевая безопасность',
              'Настройка VPN',
              'Диагностика проблем',
              'Мониторинг сети'
            ]
          });
          break;
        case 'backend':
          requirements.push({
            position: 'Backend разработчик',
            company: 'Software House',
            salary: `${minSalary+15000}-${maxSalary+25000}`,
            requirements: [
              'Python/Java/Node.js',
              'SQL и NoSQL базы данных',
              'REST API',
              'Микросервисы',
              '!Docker'
            ]
          });
          break;
        case 'frontend':
          requirements.push({
            position: 'Frontend разработчик',
            company: 'Web Solutions',
            salary: `${minSalary+10000}-${maxSalary+20000}`,
            requirements: [
              'JavaScript/TypeScript',
              'React/Vue.js',
              'HTML5/CSS3',
              'Web Performance',
              'REST API интеграция'
            ]
          });
          break;
        case 'fullstack':
          requirements.push({
            position: 'Fullstack разработчик',
            company: 'Digital Agency',
            salary: `${minSalary+25000}-${maxSalary+35000}`,
            requirements: [
              'JavaScript/TypeScript',
              'Node.js/Python',
              'React/Vue.js',
              'SQL/NoSQL',
              'DevOps практики'
            ]
          });
          break;
        case 'data_engineer':
          requirements.push({
            position: 'Data Engineer',
            company: 'Data Corp',
            salary: `${minSalary+30000}-${maxSalary+40000}`,
            requirements: [
              'Python/Scala',
              'SQL/NoSQL',
              'ETL процессы',
              'Big Data технологии',
              'Data Warehousing'
            ]
          });
          break;
        case 'data_scientist':
          requirements.push({
            position: 'Data Scientist',
            company: 'AI Solutions',
            salary: `${minSalary+35000}-${maxSalary+45000}`,
            requirements: [
              'Python/R',
              'Machine Learning',
              'Statistics',
              'Deep Learning',
              'Data Visualization'
            ]
          });
          break;
        case 'qa':
          requirements.push({
            position: 'QA инженер',
            company: 'Quality Tech',
            salary: `${minSalary-5000}-${maxSalary+5000}`,
            requirements: [
              'Автоматизация тестирования',
              'Selenium/Cypress',
              'API тестирование',
              'Python/Java',
              'Test Planning'
            ]
          });
          break;
        case 'security':
          requirements.push({
            position: 'IT Security специалист',
            company: 'Security Solutions',
            salary: `${minSalary+30000}-${maxSalary+40000}`,
            requirements: [
              'Сетевая безопасность',
              'Penetration Testing',
              'Security Tools',
              'Risk Assessment',
              'SIEM системы'
            ]
          });
          break;
        case 'dba':
          requirements.push({
            position: 'Database Administrator',
            company: 'Data Systems',
            salary: `${minSalary+10000}-${maxSalary+20000}`,
            requirements: [
              'SQL/NoSQL',
              'Database Design',
              'Performance Tuning',
              'Backup/Recovery',
              'Репликация данных'
            ]
          });
          break;
        case 'mobile':
          requirements.push({
            position: 'Mobile разработчик',
            company: 'Mobile Solutions',
            salary: `${minSalary+20000}-${maxSalary+30000}`,
            requirements: [
              'Swift/Kotlin',
              'React Native',
              'Mobile UI/UX',
              'REST API',
              'Mobile Security'
            ]
          });
          break;
      }
    });

    return requirements;
  }

  generateDetailedData() {
    const minSalary = parseInt(this.salaryMin.value) || 180000;
    const maxSalary = parseInt(this.salaryMax.value) || 220000;
    const avgSalary = (minSalary + maxSalary) / 2;

    this.detailedData = this.getDetailedDataForSalary(avgSalary);
    return this.detailedData;
  }

  getDetailedDataForSalary(avgSalary) {
    if (avgSalary < 150000) {
      return {
        coreTechnologies: {
          'Linux': { percentage: 75, description: 'Базовое администрирование' },
          'Windows': { percentage: 85, description: 'Active Directory, GPO' },
          'Базовые сети': { percentage: 80, description: 'TCP/IP, DHCP, DNS' },
          'Virtualization': { percentage: 70, description: 'VMware, VirtualBox' },
          'Базовый Python': { percentage: 45, description: 'Простые скрипты' }
        },
        tools: {
          'PowerShell': { percentage: 75, description: 'Базовые скрипты' },
          'Helpdesk': { percentage: 90, description: 'Системы тикетов' },
          'Backup': { percentage: 80, description: 'Резервное копирование' },
          'Monitoring': { percentage: 70, description: 'Базовый мониторинг' },
          'Git': { percentage: 50, description: 'Основы версионирования' }
        },
        methodologies: {
          'ITIL': { percentage: 80, description: 'Базовые практики' },
          'Техподдержка': { percentage: 90, description: 'Работа с пользователями' },
          'Документация': { percentage: 85, description: 'Ведение документации' },
          'Безопасность': { percentage: 70, description: 'Базовая безопасность' },
          'Отчетность': { percentage: 75, description: 'Подготовка отчетов' }
        }
      };
    } else if (avgSalary < 200000) {
      return {
        coreTechnologies: {
          'Linux': { percentage: 85, description: 'Ubuntu, CentOS, RedHat' },
          'Docker': { percentage: 80, description: 'Контейнеризация' },
          'Kubernetes': { percentage: 70, description: 'Базовая оркестрация' },
          'AWS': { percentage: 75, description: 'Cloud services' },
          'Python': { percentage: 80, description: 'Automation scripts' }
        },
        tools: {
          'Ansible': { percentage: 75, description: 'Configuration management' },
          'Jenkins': { percentage: 70, description: 'Basic CI/CD' },
          'Git': { percentage: 85, description: 'Version control' },
          'Terraform': { percentage: 65, description: 'Infrastructure as Code' },
          'Prometheus': { percentage: 60, description: 'Basic monitoring' }
        },
        methodologies: {
          'DevOps': { percentage: 80, description: 'Basic practices' },
          'Agile': { percentage: 75, description: 'Scrum/Kanban' },
          'CI/CD': { percentage: 70, description: 'Pipeline automation' },
          'GitOps': { percentage: 60, description: 'Basic principles' },
          'SRE': { percentage: 55, description: 'Basic concepts' }
        }
      };
    } else {
      return {
        coreTechnologies: {
          'Kubernetes': { percentage: 95, description: 'Expert orchestration' },
          'Cloud': { percentage: 90, description: 'Multi-cloud architecture' },
          'Terraform': { percentage: 85, description: 'Complex infrastructure' },
          'Service Mesh': { percentage: 80, description: 'Istio, Consul' },
          'Python/Go': { percentage: 85, description: 'Advanced development' }
        },
        tools: {
          'GitOps': { percentage: 90, description: 'Advanced workflows' },
          'ELK Stack': { percentage: 85, description: 'Log management' },
          'Prometheus': { percentage: 90, description: 'Advanced monitoring' },
          'Grafana': { percentage: 85, description: 'Custom dashboards' },
          'HashiCorp': { percentage: 80, description: 'Full stack' }
        },
        methodologies: {
          'DevOps': { percentage: 95, description: 'Advanced practices' },
          'SRE': { percentage: 90, description: 'Reliability engineering' },
          'Cloud Native': { percentage: 90, description: 'Architecture patterns' },
          'Security': { percentage: 85, description: 'DevSecOps' },
          'Automation': { percentage: 95, description: 'Full automation' }
        }
      };
    }
  }

  generateSkillsHistoryData() {
    const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь'];
    
    const baseSkills = {
      'Python': { color: '#3776AB', trend: 'rising' },
      'JavaScript': { color: '#F7DF1E', trend: 'stable' },
      'Java': { color: '#007396', trend: 'stable' },
      'AWS': { color: '#FF9900', trend: 'rising' },
      'Docker': { color: '#2496ED', trend: 'rising' },
      'Kubernetes': { color: '#326CE5', trend: 'rising' },
      'SQL': { color: '#4479A1', trend: 'stable' },
      'React': { color: '#61DAFB', trend: 'rising' },
      'Node.js': { color: '#339933', trend: 'rising' },
      'TypeScript': { color: '#3178C6', trend: 'rising' },
      'Go': { color: '#00ADD8', trend: 'rising' },
      'Angular': { color: '#DD0031', trend: 'declining' },
      'Vue.js': { color: '#4FC08D', trend: 'stable' },
      'Git': { color: '#F05032', trend: 'stable' }
    };

    const data = {};
    Object.keys(baseSkills).forEach(skill => {
      const trend = baseSkills[skill].trend;
      const baseValue = 50 + Math.random() * 30;
      data[skill] = {
        color: baseSkills[skill].color,
        values: months.map((_, index) => {
          let value = baseValue;
          switch (trend) {
            case 'rising':
              value += index * (3 + Math.random() * 2);
              break;
            case 'declining':
              value -= index * (2 + Math.random() * 1);
              break;
            default:
              value += (Math.random() * 4 - 2);
          }
          return Math.min(Math.max(value, 0), 100);
        })
      };
    });

    return {
      months: months,
      data: data
    };
  }

  generateTopJobsData() {
    return {
      jobs: [
        {
          title: 'Senior DevOps Engineer',
          company: 'Крупный финтех',
          salary: 450000,
          location: 'Москва',
          demand: 95,
          requirements: ['Kubernetes', 'AWS', 'Terraform', 'Python', 'CI/CD'],
          responses: 127
        },
        {
          title: 'Cloud Architect',
          company: 'IT-консалтинг',
          salary: 400000,
          location: 'Москва/Удаленно',
          demand: 90,
          requirements: ['Multi-cloud', 'Solution Architecture', 'DevOps', 'Security'],
          responses: 89
        },
        {
          title: 'SRE Engineer',
          company: 'E-commerce платформа',
          salary: 380000,
          location: 'Санкт-Петербург',
          demand: 88,
          requirements: ['Kubernetes', 'Monitoring', 'SLO/SLI', 'Automation'],
          responses: 156
        },
        {
          title: 'Lead System Administrator',
          company: 'Банковский сектор',
          salary: 320000,
          location: 'Москва',
          demand: 85,
          requirements: ['Linux', 'Windows Server', 'Virtualization', 'Security'],
          responses: 198
        },
        {
          title: 'Network Security Engineer',
          company: 'Телеком компания',
          salary: 350000,
          location: 'Москва',
          demand: 82,
          requirements: ['Cisco', 'Security', 'SD-WAN', 'Python'],
          responses: 143
        }
      ]
    };
  }

  generateSalaryTrendsData() {
    const trends = {
      'devops': {
        name: 'DevOps',
        color: '#FF6384',
        data: [120, 150, 180, 220, 250, 280]
      },
      'sysadmin': {
        name: 'Системный администратор',
        color: '#36A2EB',
        data: [90, 110, 130, 150, 170, 190]
      },
      'network': {
        name: 'Сетевой инженер',
        color: '#FFCE56',
        data: [100, 120, 140, 160, 180, 200]
      },
      'backend': {
        name: 'Backend разработчик',
        color: '#4BC0C0',
        data: [130, 160, 190, 220, 250, 280]
      },
      'frontend': {
        name: 'Frontend разработчик',
        color: '#9966FF',
        data: [120, 150, 180, 210, 240, 270]
      },
      'fullstack': {
        name: 'Fullstack разработчик',
        color: '#FF9F40',
        data: [140, 170, 200, 230, 260, 290]
      },
      'data_engineer': {
        name: 'Data Engineer',
        color: '#FF6384',
        data: [150, 180, 210, 240, 270, 300]
      },
      'data_scientist': {
        name: 'Data Scientist',
        color: '#36A2EB',
        data: [160, 190, 220, 250, 280, 310]
      },
      'qa': {
        name: 'QA инженер',
        color: '#FFCE56',
        data: [100, 120, 140, 160, 180, 200]
      },
      'security': {
        name: 'IT Security',
        color: '#4BC0C0',
        data: [140, 170, 200, 230, 260, 290]
      },
      'dba': {
        name: 'Database Administrator',
        color: '#9966FF',
        data: [120, 150, 180, 210, 240, 270]
      },
      'mobile': {
        name: 'Mobile разработчик',
        color: '#FF9F40',
        data: [130, 160, 190, 220, 250, 280]
      }
    };

    // Adjust trend data based on current salary range
    const minSalary = parseInt(this.salaryMin.value) || 180000;
    const maxSalary = parseInt(this.salaryMax.value) || 220000;
    const avgSalary = (minSalary + maxSalary) / 2;

    Object.keys(trends).forEach(key => {
      const multiplier = avgSalary / 200000; // baseline salary
      trends[key].data = trends[key].data.map(salary => Math.round(salary * multiplier));
    });

    return trends;
  }

  generateRegionalData() {
    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);
    
    const baseSalary = (parseInt(this.salaryMin.value) + parseInt(this.salaryMax.value)) / 2;
    
    const regionalCoefficients = {
      'moscow': 1.4,
      'spb': 1.2,
      'novosibirsk': 0.9,
      'ekaterinburg': 0.95,
      'kazan': 0.85,
      'vladivostok': 0.8,
      'krasnodar': 0.8,
      'remote': 1.1
    };

    const demandCoefficients = {
      'moscow': 1.5,
      'spb': 1.3,
      'novosibirsk': 0.9,
      'ekaterinburg': 1.0,
      'kazan': 0.85,
      'vladivostok': 0.7,
      'krasnodar': 0.8,
      'remote': 1.2
    };

    const data = {};
    Object.keys(this.regions).forEach(region => {
      data[region] = {
        salaries: {},
        demand: {},
        totalVacancies: Math.floor(Math.random() * 1000 + 500) * demandCoefficients[region],
        marketShare: Math.floor(Math.random() * 30 + 10)
      };

      selectedPositions.forEach(position => {
        const positionSalaryModifier = this.getPositionSalaryModifier(position);
        data[region].salaries[position] = Math.round(baseSalary * regionalCoefficients[region] * positionSalaryModifier);
        data[region].demand[position] = Math.floor(Math.random() * 40 + 60) * demandCoefficients[region];
      });
    });

    return data;
  }

  getPositionSalaryModifier(position) {
    const modifiers = {
      'devops': 1.2,
      'sysadmin': 0.9,
      'network': 1.0,
      'backend': 1.15,
      'frontend': 1.1,
      'fullstack': 1.25,
      'data_engineer': 1.3,
      'data_scientist': 1.35,
      'qa': 0.95,
      'security': 1.3,
      'dba': 1.1,
      'mobile': 1.2
    };
    return modifiers[position] || 1;
  }

  async updateData() {
    const data = this.generateMockData();
    
    // Update skills chart
    if (this.skillsChart && this.skillsChart.data) {
      this.skillsChart.data.labels = Object.keys(data.skills);
      this.skillsChart.data.datasets[0].data = Object.values(data.skills);
      this.skillsChart.update();
    }

    // Update salary chart
    if (this.salaryChart && this.salaryChart.data) {
      this.salaryChart.update();
    }

    // Update requirements list
    this.updateRequirementsList(data.requirements);
    
    // Generate and update detailed data
    this.detailedData = this.generateDetailedData();
    
    // Update detailed analysis if visible
    if (this.detailedAnalysis && !this.detailedAnalysis.classList.contains('hidden')) {
      this.updateDetailedAnalysis();
    }

    // Update top jobs
    this.updateTopJobs();
    this.updateSalaryTrends();
    this.updateDemandChart();
    this.regionalData = this.generateRegionalData();
    this.updateRegionalAnalysis();
    this.updateSkillsAnalysis();
  }

  updateRequirementsList(requirements) {
    this.requirementsList.innerHTML = requirements.map(job => `
      <div class="job-card">
        <h3>${job.position}</h3>
        <p class="company">${job.company}</p>
        <p class="salary">Зарплата: ${job.salary} ₽</p>
        <h4>Требования:</h4>
        <ul>
          ${job.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  toggleDetailedAnalysis() {
    this.detailedAnalysis.classList.toggle('hidden');
    if (!this.detailedAnalysis.classList.contains('hidden')) {
      this.updateDetailedAnalysis();
    }
  }

  updateDetailedAnalysis() {
    this.updateSkillsCategory(this.coreTechnologies, this.detailedData.coreTechnologies);
    this.updateSkillsCategory(this.tools, this.detailedData.tools);
    this.updateSkillsCategory(this.methodologies, this.detailedData.methodologies);
  }

  updateSkillsCategory(element, skills) {
    element.innerHTML = Object.entries(skills)
      .map(([name, data]) => `
        <div class="skill-item">
          <div>
            <div class="skill-name">${name}</div>
            <small>${data.description}</small>
            <div class="skill-level">
              <div class="skill-level-fill" style="width: ${data.percentage}%"></div>
            </div>
          </div>
          <span class="skill-percentage">${data.percentage}%</span>
        </div>
      `).join('');
  }

  updateTopJobs() {
    const data = this.topJobsData;
    
    this.topJobsSalaryChart.data.labels = data.jobs.map(job => job.title);
    this.topJobsSalaryChart.data.datasets[0].data = data.jobs.map(job => job.salary);
    this.topJobsSalaryChart.update();

    this.topJobsList.innerHTML = data.jobs.map(job => `
      <div class="top-job-card">
        <div class="job-header">
          <h3>${job.title}</h3>
          <span class="salary">${job.salary.toLocaleString()} ₽</span>
        </div>
        <div class="job-info">
          <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
          <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
        </div>
        <div class="job-stats">
          <div class="stat">
            <span class="label">Востребованность</span>
            <div class="progress-bar">
              <div class="progress" style="width: ${job.demand}%"></div>
            </div>
            <span class="value">${job.demand}%</span>
          </div>
          <div class="responses">
            <i class="fas fa-users"></i> ${job.responses} откликов
          </div>
        </div>
        <div class="requirements">
          ${job.requirements.map(req => `<span class="tag">${req}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  updateSalaryTrends() {
    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);

    const trends = this.generateSalaryTrendsData();
    
    // Update salary trends chart
    if (this.salaryTrendsLineChart) {
      this.salaryTrendsLineChart.data.datasets = selectedPositions.map(position => ({
        label: trends[position].name,
        data: trends[position].data,
        borderColor: trends[position].color,
        backgroundColor: trends[position].color + '20',
        tension: 0.4,
        fill: true
      }));
      
      this.salaryTrendsLineChart.update();
    }
  }

  updateSkillsAnalysis() {
    this.updateCurrentSkillsChart();
    this.updateSkillsTrendsChart();
  }

  updateCurrentSkillsChart() {
    if (!this.currentSkillsChart) return;

    const skillsData = Object.entries(this.skillsHistory.data)
      .map(([skill, data]) => ({
        skill,
        value: data.values[data.values.length - 1],
        color: data.color
      }))
      .sort((a, b) => b.value - a.value);

    this.currentSkillsChart.data.labels = skillsData.map(item => item.skill);
    this.currentSkillsChart.data.datasets[0].data = skillsData.map(item => item.value);
    this.currentSkillsChart.data.datasets[0].backgroundColor = skillsData.map(item => item.color);
    this.currentSkillsChart.data.datasets[0].borderColor = skillsData.map(item => item.color);
    
    this.currentSkillsChart.update();
  }

  updateSkillsTrendsChart() {
    if (!this.skillsTrendsChart) return;

    this.skillsTrendsChart.data.datasets = Object.entries(this.skillsHistory.data)
      .map(([skill, data]) => ({
        label: skill,
        data: data.values,
        borderColor: data.color,
        backgroundColor: data.color + '20',
        tension: 0.4,
        fill: true
      }));
    
    this.skillsTrendsChart.update();
  }

  updateDemandChart() {
    const demandData = this.generateDemandData();
    const labels = [];
    const data = [];
    const colors = [];

    Object.entries(demandData)
      .sort((a, b) => b[1].demand - a[1].demand)
      .forEach(([key, value]) => {
        const positions = {
          'devops': 'DevOps',
          'sysadmin': 'Системный администратор',
          'network': 'Сетевой инженер',
          'backend': 'Backend разработчик',
          'frontend': 'Frontend разработчик',
          'fullstack': 'Fullstack разработчик',
          'data_engineer': 'Data Engineer',
          'data_scientist': 'Data Scientist',
          'qa': 'QA инженер',
          'security': 'IT Security',
          'dba': 'Database Administrator',
          'mobile': 'Mobile разработчик'
        };

        labels.push(positions[key]);
        data.push(value.demand);
        
        // Color based on trend
        if (value.trend === 'rising') {
          colors.push('#2ecc71');
        } else if (value.trend === 'stable') {
          colors.push('#3498db');
        } else {
          colors.push('#e74c3c');
        }
      });

    if (this.demandChart) {
      this.demandChart.data.labels = labels;
      this.demandChart.data.datasets[0].data = data;
      this.demandChart.data.datasets[0].backgroundColor = colors;
      this.demandChart.data.datasets[0].borderColor = colors;
      this.demandChart.update();
    }
  }

  updateRegionalAnalysis() {
    this.updateRegionalSalaryChart();
    this.updateRegionalDemandChart();
    this.updateRegionalStats();
  }

  updateRegionalSalaryChart() {
    if (!this.regionalAnalysisChart) return;

    const ctx = this.regionalAnalysisChart.getContext('2d');
    if (this.regionalSalaryChart) {
      this.regionalSalaryChart.destroy();
    }

    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);
    
    const datasets = selectedPositions.map(position => {
      const color = this.getRandomColor();
      return {
        label: this.getPositionLabel(position),
        data: Object.keys(this.regions).map(region => 
          this.regionalData[region].salaries[position]
        ),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      };
    });

    this.regionalSalaryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.values(this.regions), 
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Зарплата (₽)'
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('ru-RU').format(context.parsed.y) + ' ₽';
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  updateRegionalDemandChart() {
    if (!this.regionalDemandChart) return;

    const ctx = this.regionalDemandChart.getContext('2d');
    if (this.regionalDemandChart.chart) {
      this.regionalDemandChart.chart.destroy();
    }

    const selectedPositions = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(checkbox => checkbox.value);
    
    const datasets = selectedPositions.map(position => {
      const color = this.getRandomColor();
      return {
        label: this.getPositionLabel(position),
        data: Object.keys(this.regions).map(region => 
          this.regionalData[region].demand[position]
        ),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      };
    });

    this.regionalDemandChart.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(this.regions),
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Индекс востребованности'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateRegionalStats() {
    const regionalStatsContainer = document.getElementById('regionalStats');
    if (!regionalStatsContainer) return;

    let html = '<div class="region-stats-grid">';
    Object.entries(this.regions).forEach(([key, name]) => {
      const regionData = this.regionalData[key];
      const avgSalary = Object.values(regionData.salaries).reduce((a, b) => a + b, 0) / 
        Object.values(regionData.salaries).length;
      
      html += `
        <div class="region-stat-card">
          <h3>${name}</h3>
          <div class="region-stat-content">
            <p><i class="fas fa-money-bill-wave"></i> Средняя зарплата: ${Math.round(avgSalary).toLocaleString()} ₽</p>
            <p><i class="fas fa-briefcase"></i> Вакансий: ${Math.round(regionData.totalVacancies).toLocaleString()}</p>
            <p><i class="fas fa-chart-pie"></i> Доля рынка: ${regionData.marketShare}%</p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    
    regionalStatsContainer.innerHTML = html;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getPositionLabel(position) {
    const labels = {
      'devops': 'DevOps',
      'sysadmin': 'Системный администратор',
      'network': 'Сетевой инженер',
      'backend': 'Backend разработчик',
      'frontend': 'Frontend разработчик',
      'fullstack': 'Fullstack разработчик',
      'data_engineer': 'Data Engineer',
      'data_scientist': 'Data Scientist',
      'qa': 'QA инженер',
      'security': 'IT Security',
      'dba': 'Database Administrator',
      'mobile': 'Mobile разработчик'
    };
    return labels[position] || position;
  }
}

// Initialize the analyzer
const analyzer = new JobAnalyzer();