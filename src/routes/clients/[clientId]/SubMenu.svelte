<script lang="ts">
    import { page } from "$app/stores";
    import { ArrowLeftCircle } from "lucide-svelte";
    let { clientId } = $props();
    console.log("$page.url.pathname", $page.url.pathname);
    let isActive = (routePath: string) => $page.url.pathname == routePath;
</script>

<div class="navbar bg-base-100 shadow-sm w-full">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                    />
                </svg>
            </div>
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
                <li class:active={isActive(`/clients/${clientId}`)}>
                    <a href="/clients/{clientId}">Klienten Details</a>
                </li>
                <li class:active={isActive(`/clients/${clientId}/documents`)}>
                    <a href="/clients/{clientId}/documents">Dokumente</a>
                </li>
                <li class:active={isActive(`/clients/${clientId}/sessions`)}>
                    <a href="/clients/{clientId}/sessions">Sitzungs Historie</a>
                </li>
            </ul>
        </div>
        <button
            class="btn-outline btn-circle btn btn-primary flex items-center justify-center p-0 m-0 min-h-0 h-auto w-auto min-w-0"
            onmousedown={(e) => {
                if ($page.url.pathname.includes("sessions/")) {
                    window.location.href = `/clients/${clientId}/sessions`;
                } else if ($page.url.pathname.includes("clients")) {
                    window.location.href = "/clients";
                } else {
                    window.history.back();
                }
            }}
        >
            <ArrowLeftCircle size={32}></ArrowLeftCircle>
        </button>
    </div>

    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 flex gap-2 z-50">
            <li class:active={isActive(`/clients/${clientId}`)}>
                <a href="/clients/{clientId}">Klienten Details</a>
            </li>
            <li class:active={isActive(`/clients/${clientId}/documents`)}>
                <a href="/clients/{clientId}/documents">Dokumente</a>
            </li>
            <li class:active={isActive(`/clients/${clientId}/sessions`)}>
                <a href="/clients/{clientId}/sessions">Sitzungs Historie</a>
            </li>
        </ul>
    </div>
    <div class="navbar-end">
        <a
            href="/clients/{clientId}/sessions/new"
            class="btn btn-primary btn-outline h-9 min-h-9">Neue Sitzung</a
        >
    </div>
</div>

<style lang="scss">
    .active {
        a {
            background-color: var(--primary) !important;
            color: white !important;
        }
    }
</style>
