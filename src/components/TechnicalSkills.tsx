import React, { useState } from "react";
import { Hammer, Code, Database, RefreshCw, CheckSquare, Terminal, Eye, Play, Search, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { SkillCategory } from "../types";
import HoverWaveContainer from "./HoverWaveContainer";

export default function TechnicalSkills() {
  const [activeCategory, setActiveCategory] = useState<string>("automation");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedSkillIdx, setSelectedSkillIdx] = useState<number>(0);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSelectedSkillIdx(0);
  };

  const categories: SkillCategory[] = [
    {
      id: "automation",
      title: "Test Automation",
      description: "Developing robust, scalable, modular automated test frameworks with the page object pattern.",
      iconName: "Code",
      skills: [
        {
          name: "Playwright (TypeScript)",
          level: "Expert",
          description: "End-to-End browser simulation, fast execution contexts, trace viewers, and state reuse.",
          snippetTitle: "Playwright E-Commerce Cart Test (TypeScript)",
          snippetCode: `import { test, expect } from '@playwright/test';
import { UbuyCartPage } from '../pages/UbuyCartPage';

test.describe('E-Commerce Cart Automation Page Suite', () => {
  test('should successfully add item with promo code and verify discount', async ({ page }) => {
    // 1. Initialize Page Object Model
    const cartPage = new UbuyCartPage(page);
    await cartPage.navigate('/products/electronics');
    
    // 2. Select product and click Add To Cart
    await cartPage.addProductToCart('Wireless Headphones Pro');
    
    // 3. Navigate directly to shopping checkout
    await cartPage.openCartDrawer();
    await expect(cartPage.cartItemCountLabel).toHaveText('1');
    
    // 4. Input validated Promotional Code & Apply
    await cartPage.applyPromoCode('UBUYFAST40');
    
    // 5. Assert discount computation mathematically via locator assertions
    const originalPrice = await cartPage.getOriginalPrice();
    const discountedPrice = await cartPage.getDiscountedPrice();
    
    expect(discountedPrice).toBeLessThan(originalPrice);
    await expect(cartPage.promoSuccessMessage).toBeVisible();
    await expect(cartPage.promoSuccessMessage).toContainText('40% discount applied');
  });
});`
        },
        {
          name: "Selenium WebDriver (Java)",
          level: "Expert",
          description: "Cross-browser grid configuration, robust waits, dynamic locator optimizations, and custom PageFactories.",
          snippetTitle: "Selenium FluentWait Form Assertion (Java)",
          snippetCode: `package com.ubuy.qa.tests;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import java.time.Duration;

public class CheckoutRegressionTest extends BaseTestSuite {
    
    public void testCheckoutAddressValidation() {
        driver.get("https://www.ubuy.com/checkout");
        
        // Locate address inputs with robust CSS paths
        WebElement zipField = driver.findElement(By.cssSelector("input[name='shipping_zip']"));
        zipField.sendKeys("10001");
        
        // Trigger blur which starts background ZIP verification API
        zipField.sendKeys(Keys.TAB);
        
        // Wait gracefully to avoid flaky race conditions
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        WebElement stateDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//select[@name='shipping_state' and value='NY']")
        ));
        
        Assert.assertNotNull(stateDropdown, "State failed to auto-fill NY postcode correctly.");
    }
}`
        },
        {
          name: "Appium (Mobile Automation)",
          level: "Advanced",
          description: "Native and hybrid Android/iOS testing, element inspecting, gestures testing, and cross-platform capabilities setups.",
          snippetTitle: "Appium Android Gesture Driver (Java/JS)",
          snippetCode: `// Swipe gesture helper in Appium for mobile Ubuy app regression
const entryPoint = { x: 500, y: 1500 };
const destPoint = { x: 500, y: 300 };

await driver.performActions([{
  type: 'pointer',
  id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x: entryPoint.x, y: entryPoint.y },
    { type: 'pointerDown', button: 0 },
    { type: 'pointerMove', duration: 600, x: destPoint.x, y: destPoint.y },
    { type: 'pointerUp', button: 0 }
  ]
}]);`
        }
      ]
    },
    {
      id: "api",
      title: "API & Integration Testing",
      description: "Verifying backend contracts, payloads validation, status codes, response times, and auth integrations.",
      iconName: "Database",
      skills: [
        {
          name: "Postman & Newman JS",
          level: "Expert",
          description: "Complex request-chaining environments, pre-request scripts, automated environment injection, and CLI reporting.",
          snippetTitle: "Postman Integration Scripting (JS)",
          snippetCode: `// Pre-request API authentication dynamic token fetching
const tokenUrl = pm.environment.get("auth_base_url") + "/v1/oauth/token";

pm.sendRequest({
    url: tokenUrl,
    method: 'POST',
    header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(pm.environment.get("client_id") + ":" + pm.environment.get("client_secret"))
    },
    body: {
        mode: 'urlencoded',
        urlencoded: [{ key: "grant_type", value: "client_credentials" }]
    }
}, function (err, res) {
    if (res.code === 200) {
        pm.environment.set("auth_access_token", res.json().access_token);
    } else {
        console.error("Failed token generation: " + res.text());
    }
});`
        },
        {
          name: "RestAssured (Java)",
          level: "Advanced",
          description: "BDD API testing, JSON schema validation, deep property parsing, and automatic session filters.",
          snippetTitle: "RestAssured Response Assertion (Java)",
          snippetCode: `import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public void verifyProductDetailsContract() {
    given()
        .baseUri("https://api.ubuy.com")
        .header("Content-Type", "application/json")
        .pathParam("productId", "PROD9902")
    .when()
        .get("/v2/products/{productId}")
    .then()
        .statusCode(200)
        .contentType("application/json")
        .body("id", equalTo("PROD9902"))
        .body("price.currency", equalTo("USD"))
        .body("inventory.status", notNullValue())
        .body("categories", hasItem("Electronics"));
}`
        }
      ]
    },
    {
      id: "performance",
      title: "Performance & Security",
      description: "Measuring stress limits, spike resilience, database response degradation, and validating core vulnerability patterns.",
      iconName: "RefreshCw",
      skills: [
        {
          name: "Apache JMeter",
          level: "Advanced",
          description: "Structuring thread-groups, parameterization variables, HTTP cookie managers, load distribution, and visual HTML run dashboards.",
          snippetTitle: "JMeter Header Broker Config",
          snippetCode: `<!-- Typical XML element mapping for thread load requests in JMeter -->
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="Ubuy Header Broker" enabled="true">
  <collectionProp name="HeaderManager.headers">
    <elementProp name="Content-Type" elementType="Header">
      <stringProp name="Header.name">Content-Type</stringProp>
      <stringProp name="Header.value">application/json</stringProp>
    </elementProp>
    <elementProp name="Authorization" elementType="Header">
      <stringProp name="Header.name">Authorization</stringProp>
      <stringProp name="Header.value">Bearer \${auth_access_token}</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>`
        },
        {
          name: "Loadrunner & k6 (JS)",
          level: "Intermediate",
          description: "Constructing stress scenarios in JS to model scale traffic, analyzing Virtual User execution, and identifying latency bottlenecks.",
          snippetTitle: "k6 E-Commerce Checkout Stress Test (JS)",
          snippetCode: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 concurrent users
    { duration: '1m', target: 50 },  // Retain load
    { duration: '15s', target: 0 },  // Cool down
  ],
};

export default function () {
  const url = 'https://api.ubuy.com/v1/checkout/validate';
  const payload = JSON.stringify({ cartId: 'stress_test_cart_id_992' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  
  const res = http.post(url, payload, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction duration < 400ms': (r) => r.timings.duration < 400,
  });
  sleep(1);
}`
        }
      ]
    },
    {
      id: "manual",
      title: "Manual & QA Strategy",
      description: "Exploratory testing, test planning, equivalence partitioning, boundary values analysis, and continuous quality audits.",
      iconName: "CheckSquare",
      skills: [
        {
          name: "Exploratory & Ad-hoc Testing",
          level: "Expert",
          description: "Uncovering edge-cases by simulating race conditions, unexpected user clicks, network packet loss, and localized browser caching.",
          snippetTitle: "Ubuy Checkout Manual Exploratory Checklist",
          snippetCode: `## Explortorary Testing Script Checklist:

1. **Local Storage Session Hijack Checklist**:
   - Add items to cart inside Ubuy tab A.
   - Clear session cookies in tab B. Assert cart status gracefully alerts user rather than throwing standard JS NullPointerException.

2. **Network Network Throttling / Slow 3G Boundary Test**:
   - Tap 'Place Order' on 3G throttling.
   - Rapidly double-click 'Place Order' button. Verify active UI disables itself upon initial request to prevent multiple, duplicated credit card charges.

3. **Multi-Currency Rounding Invariant**:
   - Toggle currency from EUR to GBP to USD in checkout. Ensure cumulative cents display is mathematically consistent, leaving zero fractional trailing decimals.`
        },
        {
          name: "Test Planning & Case Authoring",
          level: "Expert",
          description: "Designing structured test suites, traceability matrices, severity definitions, defect tracking, and comprehensive sign-off reports.",
          snippetTitle: "Production Readiness QA Sign-Off Criteria",
          snippetCode: `## Ubuy Prod QA Gatekeeping Checklist:

- **Pass Rate**: Must maintain >= 98% overall test execution pass index.
- **Severity SLA**: Exactly 0 unresolved Critical/Blocker defects outstanding.
- **Automation Index**: Core business flows (Cart, Payments, Search, Signup) covered in nightly regression with zero flakiness.
- **Rollback Proofing**: Post-deploy smoke suite executed in staging against identical database migration scripts.`
        }
      ]
    }
  ];

  const activeCatData = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div id="technical-skills" className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800 mb-3">
            <Hammer className="w-3 h-3 text-[#0071e3]" />
            <span>EXPERT TOOLBELT</span>
          </div>
          <h2 className="text-section-title text-white">Structured Quality Competencies</h2>
          <p className="text-sm text-[#86868b] mt-1.5">
            Browse through categories, select dynamic frameworks to inspect their verified code architectures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Category Toggles Side */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                id={`skill-cat-btn-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-left p-5 rounded-2xl border transition-all relative group cursor-pointer ${
                  isActive
                    ? "border-zinc-700 bg-zinc-900/40"
                    : "bg-[#111112] border-[#2c2c2e] hover:border-zinc-800"
                }`}
              >
                {isActive && (
                  <div className="absolute top-5 left-0 w-1 h-8 bg-[#0071e3] rounded-r-md z-10" />
                )}
                
                <div className="relative flex items-center gap-3.5 z-10">
                  <div className={`p-2.5 rounded-xl transition-transform ${
                    isActive ? "bg-[#0071e3]/10 text-[#0071e3]" : "bg-zinc-900 text-zinc-400"
                  }`}>
                    {cat.id === "automation" && <Code className="w-4 h-4" />}
                    {cat.id === "api" && <Database className="w-4 h-4" />}
                    {cat.id === "performance" && <RefreshCw className="w-4 h-4" />}
                    {cat.id === "manual" && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold transition-colors ${isActive ? "text-white" : "text-zinc-300"}`}>
                      {cat.title}
                    </h4>
                    <span className="text-[10px] text-zinc-500">
                      {cat.skills.length} core tools highlighted
                    </span>
                  </div>
                </div>
                <p className="relative text-xs text-[#86868b] mt-3 line-clamp-2 leading-relaxed z-10 text-left">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Skill Details & Sandbox view */}
        <HoverWaveContainer className="lg:col-span-8 bg-transparent border-transparent">
          {/* Header */}
          <div className="border-b border-[#2c2c2e] p-5 bg-black flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">PLAYGROUND INSPECTOR</span>
              <h3 className="text-[13px] font-semibold text-white mt-0.5">{activeCatData.title} Skills Case Study</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
            {/* Inner Left: Skill List with Levels */}
            <div className="md:col-span-5 border-r border-[#2c2c2e] p-5 space-y-3 bg-black/40">
              <span className="text-[10px] uppercase text-zinc-500 tracking-wider block font-semibold text-left">Highlighted Frameworks</span>
              {activeCatData.skills.map((skill, sIdx) => {
                const isSelected = sIdx === selectedSkillIdx;
                return (
                  <button
                    key={sIdx}
                    onClick={() => setSelectedSkillIdx(sIdx)}
                    className={`text-left w-full p-4 border rounded-xl space-y-2 cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-[#0071e3]/10 border-[#0071e3]/40" 
                        : "bg-black border-zinc-900/65 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className={`text-xs font-semibold ${isSelected ? "text-[#0071e3]" : "text-zinc-200"}`}>{skill.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        skill.level === "Expert" 
                          ? "bg-zinc-800 text-white" 
                          : "bg-zinc-900 text-zinc-400"
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#86868b] leading-relaxed text-left">
                      {skill.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Inner Right: Dynamic Test Script Code-Viewer */}
            <div className="md:col-span-7 flex flex-col bg-black">
              <div className="p-4 border-b border-[#2c2c2e] bg-[#111112]/50 flex justify-between items-center text-xs">
                <span className="text-[#86868b] font-mono text-[11px] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#0071e3]" />
                  {activeCatData.skills[selectedSkillIdx]?.snippetTitle || "Test_Case_Snippet.ts"}
                </span>
                {activeCatData.skills[selectedSkillIdx]?.snippetCode && (
                  <button
                    id="copy-snippet-btn"
                    onClick={() => handleCopy(activeCatData.skills[selectedSkillIdx].snippetCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer text-[10px] transition font-semibold"
                  >
                    {copiedText === activeCatData.skills[selectedSkillIdx].snippetCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex-1 p-5 font-mono text-[11px] overflow-y-auto max-h-[350px] leading-relaxed text-zinc-400 bg-black">
                <motion.pre 
                  key={`${activeCategory}-${selectedSkillIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="whitespace-pre-wrap select-all text-left"
                >
                  <code>{activeCatData.skills[selectedSkillIdx]?.snippetCode || "// No snippet provided"}</code>
                </motion.pre>
              </div>
            </div>
          </div>
        </HoverWaveContainer>
      </div>
    </div>
  );
}
