<script lang="ts">
    import type { User } from "../../app";
    import { getFileRessource } from "$lib/pbhelper";
    import avatar from "$lib/assets/avatar.png";

    let { data }: { data: User } = $props();
    let user: User = $state(data.user);
</script>

<nav class="navbar bg-base-100 border-b">
    <div class="flex-1">
        <a href="/clients" class="btn btn-ghost normal-case text-xl"
            >Klientenverwaltung</a
        >
    </div>
    <div class="flex-none">
        {#if !data.user}
            <div class="dropdown dropdown-end">
                <a href="/login" class="btn btn-primary">Login</a>
            </div>
        {:else}
            <div class="dropdown dropdown-end mr-4">
                <a href="/clients/new" class="btn btn-primary btn-outline"
                    >Neuer Klient</a
                >
            </div>
            <div class="dropdown dropdown-end">
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <label
                    for="avatar"
                    tabindex="0"
                    class="btn btn-ghost btn-circle avatar"
                >
                    <div id="avatar" class=" w-12 rounded-full">
                        <img
                            src={user?.avatar
                                ? getFileRessource(
                                      user.collectionId,
                                      user.id,
                                      user.avatar,
                                  )
                                : avatar}
                            alt="Avatar User"
                            srcset=""
                        />
                    </div>
                </label>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <ul
                    tabindex="0"
                    class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-10"
                >
                    <li>
                        <a href="/clients" class="">Klienten</a>
                    </li>
                    <li>
                        <form action="/logout" method="POST">
                            <button type="submit"> Logout</button>
                        </form>
                    </li>
                </ul>
            </div>
        {/if}
    </div>
</nav>
