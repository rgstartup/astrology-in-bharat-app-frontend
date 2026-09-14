// env.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        PORT?: string;

        NEXT_PUBLIC_API_URL: string;
        NEXT_PUBLIC_MAIN_URL: string;

        // add your custom vars here
    }
}