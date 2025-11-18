import { NextResponse } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD || "lead!123";

const STATUS = {
  PASS: "PASS",
  FAIL: "FAIL",
  WARN: "WARN",
  SKIP: "SKIP",
} as const;

function resolveUploaderBase(): string {
  const raw = (process.env.UPLOADER_URL || process.env.NEXT_PUBLIC_UPLOADER_URL || "").trim();

  if (!raw) return "";

  return raw.replace(/\/+$/, "");
}

export async function GET(request: Request) {
  const pwd = request.headers.get("x-admin-password");

  if (pwd !== PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploaderUrl = resolveUploaderBase();
  const uploaderDir = process.env.UPLOADER_DIR || "images";

  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    config: {
      uploaderUrl: uploaderUrl || "NOT SET",
      uploaderDir,
      hasUploaderUrl: !!uploaderUrl,
    },
    tests: {} as Record<string, any>,
  };

  if (!uploaderUrl) {
    diagnostics.tests.configuration = {
      status: STATUS.FAIL,
      message: "UPLOADER_URL or NEXT_PUBLIC_UPLOADER_URL environment variable is not set",
      fix: "Set UPLOADER_URL in your Railway environment variables",
    };
    diagnostics.summary = {
      status: "SOME TESTS FAILED",
      failed: 1,
      warnings: 0,
      nextSteps: "Provide a valid UPLOADER_URL and rerun diagnostics.",
    };

    return NextResponse.json(diagnostics);
  }

  diagnostics.tests.configuration = {
    status: STATUS.PASS,
    message: "Uploader URL is configured",
  };

  // Test 2: Reachability
  try {
    const rootResponse = await fetch(`${uploaderUrl}/`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    diagnostics.tests.connectivity = {
      status: rootResponse.ok ? STATUS.PASS : STATUS.WARN,
      statusCode: rootResponse.status,
      message: rootResponse.ok
        ? "PHP uploader is reachable"
        : `PHP uploader returned status ${rootResponse.status}`,
    };

    const contentType = rootResponse.headers.get("content-type") || "";

    diagnostics.tests.uploaderHealth = {
      status: contentType.includes("text/html") ? STATUS.PASS : STATUS.WARN,
      message: contentType.includes("text/html")
        ? "Uploader root responds with HTML form"
        : `Expected text/html but received: ${contentType || "(missing)"}`,
    };
  } catch (error: any) {
    diagnostics.tests.connectivity = {
      status: STATUS.FAIL,
      message: `Cannot connect to uploader: ${error?.message || error}`,
      fix: "Verify that the PHP uploader service is running and the URL is accessible",
    };
    diagnostics.tests.uploaderHealth = {
      status: STATUS.SKIP,
      message: "Health check skipped because connectivity failed",
    };
  }

  // Test 3: CORS headers
  try {
    const corsResponse = await fetch(`${uploaderUrl}/`, {
      method: "OPTIONS",
      signal: AbortSignal.timeout(5000),
    });
    const corsHeader = corsResponse.headers.get("access-control-allow-origin") || "";

    diagnostics.tests.cors = {
      status: corsHeader ? STATUS.PASS : STATUS.WARN,
      allowOrigin: corsHeader || "(not set)",
      message: corsHeader
        ? "CORS headers are present"
        : "Expected Access-Control-Allow-Origin header",
    };
  } catch (error: any) {
    diagnostics.tests.cors = {
      status: STATUS.WARN,
      message: `CORS OPTIONS request failed: ${error?.message || error}`,
    };
  }

  // Test 4: Debug endpoint provides storage info
  try {
    const debugResponse = await fetch(`${uploaderUrl}/debug`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (debugResponse.ok) {
      const debugJson = await debugResponse.json().catch(() => null);

      diagnostics.tests.debugEndpoint = {
        status: STATUS.PASS,
        message: "Debug endpoint reachable",
        storageRoot: debugJson?.storage?.STORAGE_ROOT || undefined,
        fileCount: debugJson?.file_count ?? undefined,
      };
    } else {
      diagnostics.tests.debugEndpoint = {
        status: STATUS.WARN,
        statusCode: debugResponse.status,
        message: `Debug endpoint returned status ${debugResponse.status}`,
      };
    }
  } catch (error: any) {
    diagnostics.tests.debugEndpoint = {
      status: STATUS.WARN,
      message: `Debug endpoint check failed: ${error?.message || error}`,
    };
  }

  const results = Object.values(diagnostics.tests) as Array<{ status: string }>;
  const failed = results.filter((t) => t.status === STATUS.FAIL).length;
  const warnings = results.filter((t) => t.status === STATUS.WARN).length;

  diagnostics.summary = {
    status: failed === 0 && warnings === 0
      ? "ALL TESTS PASSED"
      : failed > 0
        ? "SOME TESTS FAILED"
        : "WARNINGS DETECTED",
    failed,
    warnings,
    nextSteps: failed === 0 && warnings === 0
      ? "Your uploader is configured correctly. Try uploading an image from the dashboard."
      : "Review the failing or warning tests above and apply the suggested fixes.",
  };

  return NextResponse.json(diagnostics, { status: failed > 0 ? 502 : 200 });
}

