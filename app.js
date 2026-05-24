/* ==========================================================================
   PORTFOLIO INTERACTIVE CORE ENGINE - app.js
   Manages Canvas Networks, CLI Terminal, Sandbox Simulator, Swagger UI & REST Client
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================================================
     1. NETWORK NODE CANVAS BACKGROUND
     ========================================================================== */
  const initNetworkCanvas = () => {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    window.addEventListener("resize", () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });
    
    const numNodes = Math.min(45, Math.floor((width * height) / 30000));
    const nodes = [];
    const maxDistance = 140;
    
    // Create random server nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;
        
        // Bounce off bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        const dynamicRadius = node.radius + Math.sin(node.pulse) * 0.5;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
        ctx.fill();
        
        // Slight cyan glow around nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.05)";
        ctx.fill();
      });
      
      // Draw elastic network lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  initNetworkCanvas();

  /* ==========================================================================
     2. MOCK DATASETS & STATS
     ========================================================================== */
  const projectsData = {
    "data-import": {
      title: "High-Performance Data Import Service",
      description: "A high-throughput Excel data parsing and validation ingestion service written in Go. Leverages excelize reader streams to ingest large structures efficiently, caching frequently queried validation records in Redis to bypass direct DB overhead.",
      tags: ["Golang", "Redis Cache", "REST API", "SQL", "Excelize"],
      duration: "14ms",
      architectureSvg: `
        <svg viewBox="0 0 400 180" width="100%" height="100%">
          <rect x="10" y="70" width="70" height="40" rx="6" fill="#111520" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="45" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Excel Upload</text>
          
          <path d="M 80,90 L 130,90" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 2"/>
          
          <rect x="130" y="70" width="80" height="40" rx="6" fill="#111520" stroke="#10b981" stroke-width="1.5"/>
          <text x="170" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Go Parser (Streams)</text>
          
          <path d="M 210,80 L 250,55" stroke="#06b6d4" stroke-width="1.5"/>
          <path d="M 210,100 L 250,125" stroke="#06b6d4" stroke-width="1.5"/>
          
          <rect x="250" y="30" width="80" height="30" rx="4" fill="#111520" stroke="#8b5cf6" stroke-width="1"/>
          <text x="290" y="48" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">Redis (Cache-Aside)</text>
          
          <rect x="250" y="120" width="80" height="30" rx="4" fill="#111520" stroke="#06b6d4" stroke-width="1"/>
          <text x="290" y="138" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">PostgreSQL DB</text>
        </svg>
      `,
      jsonResponse: {
        status: "success",
        data: {
          project_id: "data_import_service_v1",
          performance: {
            parsing_engine: "Excelize Stream Ingestion",
            caching_strategy: "Cache-Aside Memory Store",
            average_ingest_time_ms: 14.5
          },
          features: [
            "Asynchronous line-by-line cell coordinates validation",
            "Redis cache-aside lookup for schema integrity verification",
            "Automatic invalid row aggregation and transactional rollback logs"
          ],
          freelance_availability: "Yes - open for freelance query optimizations and API scaling"
        }
      }
    },
    "task-scheduler": {
      title: "Distributed Task Scheduler",
      description: "An asynchronous task orchestration and queue scheduler written in Go. Implements non-blocking scheduling using Go channel multiplexers to distribute pending background execution payloads across concurrent goroutine thread pools.",
      tags: ["Golang", "Concurrency", "Goroutines", "Go Channels", "REST API"],
      duration: "10ms",
      architectureSvg: `
        <svg viewBox="0 0 400 180" width="100%" height="100%">
          <rect x="10" y="70" width="60" height="40" rx="6" fill="#111520" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="40" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Task API</text>
          
          <path d="M 70,90 L 120,90" stroke="#f97316" stroke-width="1.5"/>
          
          <rect x="120" y="70" width="90" height="40" rx="6" fill="#111520" stroke="#f97316" stroke-width="1.5"/>
          <text x="165" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Go Channels Queue</text>
          
          <path d="M 210,80 L 250,55" stroke="#10b981" stroke-width="1.5"/>
          <path d="M 210,100 L 250,125" stroke="#10b981" stroke-width="1.5"/>
          
          <rect x="250" y="30" width="80" height="30" rx="4" fill="#111520" stroke="#10b981" stroke-width="1"/>
          <text x="290" y="48" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">Goroutine Worker A</text>
          
          <rect x="250" y="120" width="80" height="30" rx="4" fill="#111520" stroke="#10b981" stroke-width="1"/>
          <text x="290" y="138" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">Goroutine Worker B</text>
        </svg>
      `,
      jsonResponse: {
        status: "success",
        data: {
          scheduler_identity: "distributed_cron_goroutines",
          channel_structures: {
            queue_type: "Buffered concurrent FIFO Channel",
            blocking_prevention: "select case default channel drop"
          },
          concurrency: {
            active_worker_threads: 24,
            average_execution_overhead_us: 125
          },
          freelance_availability: "Available - skilled in Go channels, context cancellations, and race condition debugs"
        }
      }
    },
    "telemetry-api": {
      title: "High-Performance Telemetry API",
      description: "Designed and deployed at Ellume Technology to process time-series device data streams. Employs Postgres query optimization (eager loading) to reduce latency by 43%, and integrates Docker containers and rate-limiting to prevent API flooding.",
      tags: ["Golang", "Docker", "Gin", "Postgres SQL", "AWS S3", "Redis", "RabbitMQ"],
      duration: "22ms",
      architectureSvg: `
        <svg viewBox="0 0 400 180" width="100%" height="100%">
          <rect x="10" y="70" width="70" height="40" rx="6" fill="#111520" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="45" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">IoT Devices</text>
          
          <path d="M 80,90 L 130,90" stroke="#06b6d4" stroke-width="1.5"/>
          
          <rect x="130" y="70" width="90" height="40" rx="6" fill="#111520" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="175" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Gin API & Rate Lmt</text>
          
          <path d="M 220,80 L 260,55" stroke="#10b981" stroke-width="1.5"/>
          <path d="M 220,100 L 260,125" stroke="#10b981" stroke-width="1.5"/>
          
          <rect x="260" y="30" width="90" height="30" rx="4" fill="#111520" stroke="#10b981" stroke-width="1"/>
          <text x="305" y="48" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">Postgres (Eager load)</text>
          
          <rect x="260" y="120" width="90" height="30" rx="4" fill="#111520" stroke="#8b5cf6" stroke-width="1"/>
          <text x="305" y="138" fill="#f8fafc" font-family="var(--font-mono)" font-size="8" text-anchor="middle">RabbitMQ Queue</text>
        </svg>
      `,
      jsonResponse: {
        status: "success",
        data: {
          client_context: "Ellume Technology Telemetries",
          optimizations: {
            latency_reduction_rate: "43% improvement",
            technique: "PostgreSQL JOIN/Preload eager queries, preventing N+1 read patterns",
            system_resilience: "Dockerized, rate-limited middleware"
          },
          stack_metrics: {
            payload_type: "IoT Time-series device packets",
            average_check_time_ms: 22.4
          },
          freelance_availability: "Open - expert in Postgres eager loading, relational tuning, and containerized scale"
        }
      }
    },
    "report-delivery": {
      title: "Secure Report Delivery & Email Broker",
      description: "Designed at Tata Consultancy Services (TCS) to bundle high-volume report exports. Safely saves reports onto AWS S3 with time-bound secure pre-signed URLs, handing off notifications to RabbitMQ message brokers for microservices email distribution.",
      tags: ["Golang", "Gin", "AWS S3", "RabbitMQ Broker", "Postgres", "Redis"],
      duration: "16ms",
      architectureSvg: `
        <svg viewBox="0 0 400 180" width="100%" height="100%">
          <rect x="10" y="70" width="70" height="40" rx="6" fill="#111520" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="45" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">Report Request</text>
          
          <path d="M 80,90 L 130,90" stroke="#8b5cf6" stroke-width="1.5"/>
          
          <rect x="130" y="70" width="80" height="40" rx="6" fill="#111520" stroke="#8b5cf6" stroke-width="1.5"/>
          <text x="170" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">AWS S3 PreSign</text>
          
          <path d="M 210,90 L 260,90" stroke="#f97316" stroke-width="1.5"/>
          
          <rect x="260" y="70" width="80" height="40" rx="6" fill="#111520" stroke="#f97316" stroke-width="1.5"/>
          <text x="300" y="94" fill="#f8fafc" font-family="var(--font-mono)" font-size="9" text-anchor="middle">RabbitMQ Queue</text>
          
          <path d="M 340,90 L 370,90" stroke="#10b981" stroke-width="1.5"/>
          <circle cx="380" cy="90" r="10" fill="#10b981"/>
          <text x="380" y="93" fill="#05070c" font-family="var(--font-mono)" font-size="9" font-weight="bold" text-anchor="middle">@</text>
        </svg>
      `,
      jsonResponse: {
        status: "success",
        data: {
          corporate_context: "Tata Consultancy Services (TCS) Reports",
          delivery_flows: {
            storage: "AWS S3 Cloud Storage Bucket",
            link_encryption: "Time-bound HMAC-SHA256 signature token",
            notification_broker: "RabbitMQ exchange queue microservice"
          },
          resiliency: "Decoupled architecture guarantees that spikes in report requests do not choke the mail client gateways",
          freelance_availability: "Open - available for AWS pipeline setups, RabbitMQ asynchronous scaling, and email workers"
        }
      }
    }
  };

  /* ==========================================================================
     3. INTERACTIVE TERMINAL COMPONENT
     ========================================================================== */
  const terminalInput = document.getElementById("terminal-text-input");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalCursor = document.getElementById("terminal-cursor");
  const clockDisplay = document.getElementById("terminal-clock");
  const latencyDisplay = document.getElementById("current-latency-display");
  
  // Real-time latency fluctuations in navigation bar
  setInterval(() => {
    if (latencyDisplay) {
      const base = 12;
      const variation = Math.floor(Math.random() * 6) - 3;
      latencyDisplay.textContent = Math.max(8, base + variation);
    }
  }, 3500);

  // Auto-updating Terminal Header Clock (UTC format)
  const updateClock = () => {
    if (!clockDisplay) return;
    const now = new Date();
    const utcStr = now.toISOString().replace("T", " ").substring(0, 19);
    clockDisplay.textContent = `UTC ${utcStr}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Focus terminal input on clicking the terminal window
  const terminalWindow = document.getElementById("hero-terminal");
  if (terminalWindow && terminalInput) {
    terminalWindow.addEventListener("click", () => {
      terminalInput.focus();
    });
  }

  // Print text to terminal CLI
  const printToTerminal = (text, type = "normal") => {
    if (!terminalOutput) return;
    
    const row = document.createElement("div");
    row.className = "terminal-line";
    
    if (type === "system") row.classList.add("terminal-system");
    else if (type === "success") row.classList.add("terminal-success");
    else if (type === "error") row.classList.add("terminal-error");
    else if (type === "accent") row.classList.add("terminal-accent");
    
    row.innerHTML = text;
    
    // Insert before the input row
    const inputRow = document.getElementById("active-terminal-input-row");
    terminalOutput.insertBefore(row, inputRow);
    
    // Auto scroll down
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  // Commands engine
  const handleCommand = (cmdText) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    // Echo the command back
    printToTerminal(`<span class="terminal-prompt">guest@amankumar:~$</span> ${cmdText}`);
    
    if (cleanCmd === "") return;
    
    switch (cleanCmd) {
      case "help":
        printToTerminal("Available commands inside Sys.Arch console:", "accent");
        printToTerminal("  <span class='terminal-accent'>about</span>      - Detail personal backend developer journey & freelance status");
        printToTerminal("  <span class='terminal-accent'>skills</span>     - Output active technology stack as a CLI table");
        printToTerminal("  <span class='terminal-accent'>projects</span>   - List featured engineering systems and how to query");
        printToTerminal("  <span class='terminal-accent'>status</span>     - Fetch live simulated memory allocation stats");
        printToTerminal("  <span class='terminal-accent'>clear</span>      - Clear logs history from terminal cache buffer");
        printToTerminal("  <span class='terminal-accent'>contact</span>    - Deploy handshakes for REST client message forms");
        break;
        
      case "about":
        printToTerminal("================ ABOUT AMAN KUMAR ================", "accent");
        printToTerminal("Identity: Software Engineer & Freelance Backend Contractor");
        printToTerminal("Status  : <span class='terminal-success'>ACTIVE & AVAILABLE FOR FREELANCE JOBS (PART-TIME / REMOTE)</span>");
        printToTerminal("Bio     : I engineer robust backend APIs, optimize databases (latency slashed by 43%), and build asynchronous telemetry streams.");
        printToTerminal("Timeline: Software Engineer 1 at Ellume Technology (2026-Present) | Backend Software Engineer at TCS (2025-2026).");
        printToTerminal("Contact : amanrana9133@gmail.com | +91 6299033963 | Nagpur/Muzaffarpur");
        break;
        
      case "skills":
        printToTerminal("+--------------------+---------------------------------------+", "system");
        printToTerminal("| STACK DRAWER LAYER | TECHNOLOGIES & BENCHMARKS             |", "system");
        printToTerminal("+--------------------+---------------------------------------+", "system");
        printToTerminal("| Platform & Cloud   | AWS S3/SES, Docker, Git, Mailgun, Bash|", "system");
        printToTerminal("| Application Core   | Go (Golang), Node.js, C/C++, Gin, Java|", "system");
        printToTerminal("| Storage persistence| Postgres, Redis, RabbitMQ, SQL, Mongo |", "system");
        printToTerminal("| Algorithmic Rank   | Codeforces Rank 1992, Leetcode 1700+  |", "system");
        printToTerminal("+--------------------+---------------------------------------+", "system");
        break;
        
      case "projects":
        printToTerminal("================ FEATURED BACKEND SYSTEMS ================", "accent");
        printToTerminal("1. <span class='terminal-accent'>Data Import Service</span>    - Excel stream validation + Redis caching in Go");
        printToTerminal("2. <span class='terminal-accent'>Distributed Scheduler</span>  - Task queuing using Goroutines & Go Channels");
        printToTerminal("3. <span class='terminal-accent'>Telemetry device API</span>   - Eager-loading Postgres query performance scaling");
        printToTerminal("4. <span class='terminal-accent'>Report Delivery Engine</span> - Decoupled AWS S3 pre-signed URL + RabbitMQ broker");
        printToTerminal("----------------------------------------------------------", "system");
        printToTerminal("TIP: Scroll to the <a href='#projects' style='text-decoration:underline;'>APIs Section</a> below to run live simulations!");
        break;
        
      case "status":
        printToTerminal("[POLLING LIVE ACTIVE WORKSPACES...]", "system");
        const ramUsed = (Math.random() * 0.8 + 1.2).toFixed(2);
        const cpuUsed = Math.floor(Math.random() * 12) + 4;
        printToTerminal(`  - ACTIVE_CLIENT_SHARDS : Ellume Technology Cluster, TCS Report Broker`, "success");
        printToTerminal(`  - HOST_U_BOUNDS_IOPS   : Postgres Time-Series query eager preloads active`, "success");
        printToTerminal(`  - REDIS_CACHE_SAVINGS  : 43% response latency compression sustained`, "success");
        printToTerminal(`  - REMOTE_AVAILABILITY  : Part-time freelance contracts open ( नागपुर / मुजफ्फरपुर )`, "success");
        break;
        
      case "clear":
        // Delete all rows except the active input row
        const lines = Array.from(terminalOutput.querySelectorAll(".terminal-line"));
        lines.forEach(line => line.remove());
        break;
        
      case "contact":
        printToTerminal("Deploying contact endpoint handshake...", "system");
        printToTerminal("Redirection path set. Scroll to the <a href='#contact' style='text-decoration:underline;'>cURL REST Client Form Section</a> at base of page.", "success");
        window.location.hash = "#contact";
        break;
        
      default:
        printToTerminal(`sh: command not found: '${cleanCmd}'. Type 'help' to see list of valid scripts.`, "error");
    }
  };

  // Keyboard action listener
  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = terminalInput.value;
        handleCommand(cmd);
        terminalInput.value = "";
      }
    });
  }

  // Hook terminal quick script pills click
  const pills = document.querySelectorAll(".terminal-shortcuts .pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      const cmdText = pill.getAttribute("data-cmd");
      if (terminalInput) {
        terminalInput.value = "";
      }
      handleCommand(cmdText);
    });
  });

  /* ==========================================================================
     4. THE ARCHITECTURE PLAYGROUND (SYSTEM METRICS STATE MACHINE)
     ========================================================================== */
  const nodeLB = document.getElementById("node-lb");
  const nodeServers = document.getElementById("node-servers");
  const nodeRedis = document.getElementById("node-redis");
  const nodeDB = document.getElementById("node-db");
  const activeSrvLabel = document.getElementById("srv-node-text");
  const dbReplicaText = document.getElementById("db-replica-text");
  
  // Connect SVG Pipeline Paths
  const pipeClientLB = document.getElementById("pipe-client-lb");
  const pipeLBServer1 = document.getElementById("pipe-lb-server1");
  const pipeLBServer2 = document.getElementById("pipe-lb-server2");
  const pipeServer1Redis = document.getElementById("pipe-server1-redis");
  const pipeServer2Redis = document.getElementById("pipe-server2-redis");
  const pipeRedisDB = document.getElementById("pipe-redis-db");
  const pipeServer1DB = document.getElementById("pipe-server1-db");
  const pipeServer2DB = document.getElementById("pipe-server2-db");
  
  // Dashboard Gauge indicators
  const valLatency = document.getElementById("val-latency");
  const valThroughput = document.getElementById("val-throughput");
  const valDBLoad = document.getElementById("val-dbload");
  const valSLA = document.getElementById("val-sla");
  
  const fillLatency = document.getElementById("fill-latency");
  const fillThroughput = document.getElementById("fill-throughput");
  const fillDBLoad = document.getElementById("fill-dbload");
  const fillSLA = document.getElementById("fill-sla");
  
  const liveConsoleLog = document.getElementById("live-console-log-feed");
  const liveConsoleLogDot = document.getElementById("log-status-dot");
  const trafficIndicator = document.getElementById("traffic-multiplier-indicator");
  
  // Initial systems default states
  let systemState = {
    lbActive: true,
    serversScale: 2, // 1 = scaled down, 2 = scaled up 2x
    redisActive: false,
    dbReplication: false // false = Single node, true = replicas added
  };

  // Dynamic coordinate calculator for SVG pipelines connecting nodes
  const updatePipelinePaths = () => {
    const stage = document.getElementById("sandbox-stage");
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    
    const getCenter = (el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - stageRect.left + r.width / 2,
        y: r.top - stageRect.top + r.height / 2
      };
    };
    
    const client = getCenter(document.getElementById("node-client"));
    const lb = getCenter(document.getElementById("node-lb"));
    const servers = getCenter(document.getElementById("node-servers"));
    const redis = getCenter(document.getElementById("node-redis"));
    const db = getCenter(document.getElementById("node-db"));
    
    // Draw client to lb
    if (pipeClientLB) {
      pipeClientLB.setAttribute("d", `M ${client.x},${client.y} L ${lb.x},${lb.y}`);
    }
    
    // Branching from LB to servers
    if (pipeLBServer1 && pipeLBServer2) {
      pipeLBServer1.setAttribute("d", `M ${lb.x},${lb.y} L ${servers.x},${servers.y - 18}`);
      pipeLBServer2.setAttribute("d", `M ${lb.x},${lb.y} L ${servers.x},${servers.y + 18}`);
    }
    
    // Servers to Redis
    if (pipeServer1Redis && pipeServer2Redis) {
      pipeServer1Redis.setAttribute("d", `M ${servers.x},${servers.y - 18} L ${redis.x},${redis.y}`);
      pipeServer2Redis.setAttribute("d", `M ${servers.x},${servers.y + 18} L ${redis.x},${redis.y}`);
    }
    
    // Servers to DB
    if (pipeServer1DB && pipeServer2DB) {
      pipeServer1DB.setAttribute("d", `M ${servers.x},${servers.y - 18} L ${db.x},${db.y}`);
      pipeServer2DB.setAttribute("d", `M ${servers.x},${servers.y + 18} L ${db.x},${db.y}`);
    }
    
    // Redis to DB
    if (pipeRedisDB) {
      pipeRedisDB.setAttribute("d", `M ${redis.x},${redis.y} L ${db.x},${db.y}`);
    }
  };

  // Add event listener to resize coordinates dynamically
  window.addEventListener("resize", updatePipelinePaths);

  const updateSimulatedMetrics = () => {
    let latency = 80; // ms base
    let throughput = 8000; // rps base
    let dbLoad = 85; // % CPU base
    let sla = 99.9; // % base
    
    let logs = [];
    
    // 1. Evaluate Redis Caching Caching
    if (systemState.redisActive) {
      latency = 4.2; // Huge drop!
      dbLoad = 12;   // Cache offloads DB reads
      logs.push("[INFO] Redis Cache active. Hit rate stable at 94.2%. Offloaded DB queries.");
      
      // Update connecting pipe classes
      pipeServer1Redis.className.baseVal = "pipe-line-active";
      pipeServer2Redis.className.baseVal = "pipe-line-active";
      pipeRedisDB.className.baseVal = "pipe-db-active";
      
      // Secondary direct paths to DB dim down slightly
      pipeServer1DB.className.baseVal = "pipe-line";
      pipeServer2DB.className.baseVal = "pipe-line";
    } else {
      latency = 78;
      dbLoad = 82;
      logs.push("[WARN] Redis Cache disabled. DB executing full tables queries scanning.");
      
      // Update connecting pipe classes
      pipeServer1Redis.className.baseVal = "pipe-line";
      pipeServer2Redis.className.baseVal = "pipe-line";
      pipeRedisDB.className.baseVal = "pipe-line";
      
      // Direct servers route active
      pipeServer1DB.className.baseVal = "pipe-line-active";
      pipeServer2DB.className.baseVal = "pipe-line-active";
    }
    
    // 2. Evaluate Servers Computing Scale
    if (systemState.serversScale === 1) {
      throughput = 4500; // Less capacity
      if (!systemState.redisActive) {
        dbLoad += 10;
        latency += 15;
      }
      sla = 99.1; // Single point fail risk
      logs.push("[WARN] Scale down: Running on 1x API node. Throughput capacity reduced.");
      
      // visual dimming of path routes
      pipeLBServer2.className.baseVal = "pipe-line";
      pipeServer2DB.className.baseVal = "pipe-line";
      pipeServer2Redis.className.baseVal = "pipe-line";
    } else {
      throughput = 16000; // Scaled up!
      logs.push("[INFO] Scale up: Active clusters running 2x redundant container instances.");
      
      // restore active lines
      if (systemState.lbActive) {
        pipeLBServer2.className.baseVal = "pipe-line-active";
        if (systemState.redisActive) {
          pipeServer2Redis.className.baseVal = "pipe-line-active";
        } else {
          pipeServer2DB.className.baseVal = "pipe-line-active";
        }
      }
    }
    
    // 3. Evaluate Load Balancer
    if (!systemState.lbActive) {
      // Massive cluster routing fail!
      throughput = systemState.serversScale === 2 ? 3000 : 1500;
      sla = 84.6; // Heavy request failures
      latency *= 1.8;
      logs.push("[CAUTION] Load Balancer OFFLINE. Routing unstable, 502 Bad Gateway alerts paged.");
      
      // Visually kill active lines from LB
      pipeClientLB.className.baseVal = "pipe-line";
      pipeLBServer1.className.baseVal = "pipe-line";
      pipeLBServer2.className.baseVal = "pipe-line";
    } else {
      pipeClientLB.className.baseVal = "pipe-line-active";
      pipeLBServer1.className.baseVal = "pipe-line-active";
    }
    
    // 4. Evaluate Database Replication
    if (systemState.dbReplication) {
      dbLoad = Math.max(5, dbLoad / 2.5); // Load split!
      latency = Math.max(2, latency - 5);
      sla = Math.min(99.999, sla + 0.08);
      logs.push("[INFO] DB Replicas enabled. Read queries load-split across RDS nodes cluster.");
    } else {
      logs.push("[INFO] PostgreSQL running primary core node cluster.");
    }

    // Constraints & Limits updates
    dbLoad = Math.min(100, Math.floor(dbLoad));
    latency = parseFloat(latency.toFixed(1));
    
    // UI Elements Refresh
    valLatency.textContent = `${latency} ms`;
    valThroughput.textContent = `${throughput.toLocaleString()} RPS`;
    valDBLoad.textContent = `${dbLoad}%`;
    valSLA.textContent = `${sla}%`;
    
    // Gauges fill calculations
    fillLatency.style.width = `${Math.min(100, (latency / 150) * 100)}%`;
    fillThroughput.style.width = `${Math.min(100, (throughput / 20000) * 100)}%`;
    fillDBLoad.style.width = `${dbLoad}%`;
    fillSLA.style.width = `${((sla - 80) / 20) * 100}%`;
    
    // Gauge color indicators
    if (dbLoad > 85) {
      fillDBLoad.className = "gauge-fill fill-orange";
      valDBLoad.className = "metric-value val-orange";
    } else {
      fillDBLoad.className = "gauge-fill fill-green";
      valDBLoad.className = "metric-value val-green";
    }
    
    if (latency < 10) {
      fillLatency.className = "gauge-fill fill-green";
      valLatency.className = "metric-value val-green";
    } else {
      fillLatency.className = "gauge-fill fill-cyan";
      valLatency.className = "metric-value val-cyan";
    }
    
    if (sla < 90) {
      fillSLA.className = "gauge-fill fill-orange";
      valSLA.className = "metric-value val-orange";
      liveConsoleLogDot.style.animation = "pulse-green 0.5s infinite"; // fast emergency pulse
      liveConsoleLogDot.style.backgroundColor = "hsl(var(--accent-red))";
    } else {
      fillSLA.className = "gauge-fill fill-green";
      valSLA.className = "metric-value val-green";
      liveConsoleLogDot.style.animation = "pulse-green 2s infinite";
      liveConsoleLogDot.style.backgroundColor = "hsl(var(--accent-green))";
    }

    // Log printer
    const selectedLog = logs[Math.floor(Math.random() * logs.length)];
    liveConsoleLog.textContent = selectedLog;

    // Trigger coordinates calculation for lines to snap on resize/load
    setTimeout(updatePipelinePaths, 0);
  };

  // Node Toggles Event Triggers
  if (nodeLB) {
    nodeLB.addEventListener("click", () => {
      systemState.lbActive = !systemState.lbActive;
      nodeLB.classList.toggle("node-active", systemState.lbActive);
      const badge = nodeLB.querySelector(".node-toggle-overlay");
      badge.textContent = systemState.lbActive ? "ACTIVE" : "OFFLINE";
      updateSimulatedMetrics();
    });
  }

  if (nodeServers) {
    nodeServers.addEventListener("click", () => {
      systemState.serversScale = systemState.serversScale === 2 ? 1 : 2;
      activeSrvLabel.textContent = systemState.serversScale === 2 ? "App Nodes (2x)" : "App Node (1x)";
      const badge = nodeServers.querySelector(".node-toggle-overlay");
      badge.textContent = systemState.serversScale === 2 ? "SCALE DOWN" : "SCALE UP";
      updateSimulatedMetrics();
    });
  }

  if (nodeRedis) {
    nodeRedis.addEventListener("click", () => {
      systemState.redisActive = !systemState.redisActive;
      nodeRedis.classList.toggle("node-active", systemState.redisActive);
      const badge = nodeRedis.querySelector(".node-toggle-overlay");
      badge.textContent = systemState.redisActive ? "ACTIVE" : "DISABLED";
      updateSimulatedMetrics();
    });
  }

  if (nodeDB) {
    nodeDB.addEventListener("click", () => {
      systemState.dbReplication = !systemState.dbReplication;
      dbReplicaText.textContent = systemState.dbReplication ? "REPLICAS" : "SINGLE";
      updateSimulatedMetrics();
    });
  }

  // Load initial variables
  updateSimulatedMetrics();

  /* ==========================================================================
     5. API PROJECTS EXPLORER
     ========================================================================= */
  const apiItems = document.querySelectorAll(".endpoint-list .endpoint-item");
  const apiActiveEndpointDisplay = document.getElementById("api-active-endpoint-display");
  const btnTriggerApi = document.getElementById("btn-trigger-api");
  const responseJsonContainer = document.getElementById("api-json-response");
  
  // Metadata fields
  const projDetailTitle = document.getElementById("proj-detail-title");
  const projDetailDesc = document.getElementById("proj-detail-desc");
  const projDetailTags = document.getElementById("proj-detail-tags");
  const projDetailDiagram = document.getElementById("proj-detail-diagram");
  const responseStatusBadge = document.getElementById("response-status-badge");
  const responseDurationBadge = document.getElementById("response-duration-badge");
  
  let currentSelectedProject = "data-import";

  // Formats JSON string to beautiful HTML tags for syntax highlighting
  const syntaxHighlightJson = (jsonObj) => {
    let jsonStr = JSON.stringify(jsonObj, null, 2);
    // Escape characters
    jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
      let cls = 'json-val-num';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-val-str';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-val-bool';
      } else if (/null/.test(match)) {
        cls = 'json-val-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };

  const loadProjectDetails = (projectId) => {
    const proj = projectsData[projectId];
    if (!proj) return;
    
    // Set metadata fields
    projDetailTitle.textContent = proj.title;
    projDetailDesc.textContent = proj.description;
    
    // Tag list loader
    projDetailTags.innerHTML = "";
    proj.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "project-pill";
      span.textContent = tag;
      projDetailTags.appendChild(span);
    });
    
    // Diagram loader
    projDetailDiagram.innerHTML = proj.architectureSvg;
    
    // Clean response pane initially (Swagger like placeholder)
    responseJsonContainer.innerHTML = `<span style="color: hsl(var(--text-muted)); font-family: var(--font-mono); font-size: 0.85rem;">// Click SEND above to query raw data from api.aman.dev server</span>`;
    responseStatusBadge.innerHTML = `<span style="width: 6px; height: 6px; background-color: hsl(var(--text-muted)); border-radius:50%;"></span><span style="color: hsl(var(--text-muted));">STATUS: IDLE</span>`;
    responseDurationBadge.textContent = "TIME: -- ms";
  };

  // Endpoint item selection
  apiItems.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active from all
      apiItems.forEach(i => i.classList.remove("item-active"));
      // Make this active
      item.classList.add("item-active");
      
      const projectId = item.getAttribute("data-project");
      currentSelectedProject = projectId;
      
      const path = item.querySelector(".endpoint-path").textContent;
      apiActiveEndpointDisplay.textContent = path;
      
      loadProjectDetails(projectId);
    });
  });

  // Simulated Send API Request
  if (btnTriggerApi) {
    btnTriggerApi.addEventListener("click", () => {
      const proj = projectsData[currentSelectedProject];
      if (!proj) return;
      
      btnTriggerApi.disabled = true;
      btnTriggerApi.querySelector("span").textContent = "SENDING...";
      
      responseJsonContainer.innerHTML = `<span class="cursor" style="height: 10px; width: 6px;"></span> <span style="color: hsl(var(--text-muted));">polling dynamic payload indexes...</span>`;
      
      // Short network request delay simulation (wow factor)
      setTimeout(() => {
        btnTriggerApi.disabled = false;
        btnTriggerApi.querySelector("span").textContent = "SEND";
        
        // Populate payload response
        responseJsonContainer.innerHTML = syntaxHighlightJson(proj.jsonResponse);
        
        // Success state details
        responseStatusBadge.innerHTML = `<span style="width: 6px; height: 6px; background-color: hsl(var(--accent-green)); border-radius:50%; box-shadow: var(--shadow-glow-green);"></span><span style="color: hsl(var(--accent-green));">STATUS: 200 OK</span>`;
        responseDurationBadge.textContent = `TIME: ${proj.duration}`;
      }, 4000); // 400ms loading duration
    });
  }

  // Load first item defaults
  loadProjectDetails("data-import");

  /* ==========================================================================
     6. cURL REST CLIENT CONTACT FORM
     ========================================================================== */
  const contactTextarea = document.getElementById("contact-json-textarea");
  const jsonIndicator = document.getElementById("json-syntax-indicator");
  const btnTriggerContact = document.getElementById("btn-trigger-contact");
  const contactResponsePanel = document.getElementById("contact-response-panel");
  const contactResponseConsole = document.getElementById("contact-response-console");
  const contactResponseStatus = document.getElementById("contact-response-status-badge");
  const contactResponseDuration = document.getElementById("contact-response-duration");

  // Validate JSON string
  const checkJSONSyntax = () => {
    if (!contactTextarea) return false;
    const bodyStr = contactTextarea.value.trim();
    
    try {
      JSON.parse(bodyStr);
      if (jsonIndicator) {
        jsonIndicator.textContent = "✓ VALID JSON";
        jsonIndicator.style.color = "hsl(var(--accent-green))";
      }
      return true;
    } catch (e) {
      if (jsonIndicator) {
        jsonIndicator.textContent = `✗ INVALID JSON: Syntax error`;
        jsonIndicator.style.color = "hsl(var(--accent-red))";
      }
      return false;
    }
  };

  if (contactTextarea) {
    contactTextarea.addEventListener("input", checkJSONSyntax);
  }

  // Handle mock API submit form
  if (btnTriggerContact) {
    btnTriggerContact.addEventListener("click", () => {
      const isValid = checkJSONSyntax();
      if (!isValid) {
        alert("Payload has JSON formatting syntax errors. Please resolve syntax errors before initiating secure handshake.");
        return;
      }
      
      btnTriggerContact.disabled = true;
      btnTriggerContact.querySelector("span").textContent = "SENDING...";
      
      // Ensure panel active
      contactResponsePanel.classList.add("panel-active");
      contactResponseConsole.innerHTML = "";
      
      // Logging script outputs sequential lines for terminal feel
      const logFeedLines = [
        "Connecting to secure host node on https://api.aman.dev/v1/contact/handshake...",
        "SSL TCP Tunnel Handshake establishing... done.",
        "Headers verified: [Content-Type: application/json, Host: api.aman.dev]",
        "Encrypting JSON envelope structures...",
        "Sending API request payload (bytes: 356)...",
        "[SUCCESS] HTTP 201 Created. Handshake complete.",
        "Response payload received: { 'status': 'success', 'paged': 'true', 'message': 'Secure line open! Aman has been notified. Code: 0x2A' }"
      ];
      
      let currentLineIdx = 0;
      const printNextLogLine = () => {
        if (currentLineIdx < logFeedLines.length) {
          const div = document.createElement("div");
          div.style.lineHeight = "1.5";
          
          if (logFeedLines[currentLineIdx].includes("[SUCCESS]")) {
            div.style.color = "hsl(var(--accent-green))";
          } else if (logFeedLines[currentLineIdx].includes("Response payload")) {
            div.style.color = "hsl(var(--text-code))";
            div.style.marginTop = "0.5rem";
          } else {
            div.style.color = "hsl(var(--text-muted))";
          }
          
          div.innerHTML = `<span style="color: hsl(var(--accent-cyan)); font-weight:bold;">&gt;&gt;</span> ${logFeedLines[currentLineIdx]}`;
          contactResponseConsole.appendChild(div);
          contactResponseConsole.scrollTop = contactResponseConsole.scrollHeight;
          
          currentLineIdx++;
          setTimeout(printNextLogLine, 120);
        } else {
          // Finalize button state
          btnTriggerContact.disabled = false;
          btnTriggerContact.querySelector("span").textContent = "SEND";
          
          contactResponseStatus.textContent = "HTTP 201 CREATED";
          contactResponseStatus.style.color = "hsl(var(--accent-green))";
          contactResponseDuration.textContent = `TIME: ${Math.floor(Math.random() * 50) + 110}ms`;
        }
      };
      
      // Start logging stream
      printNextLogLine();
    });
  }

});
