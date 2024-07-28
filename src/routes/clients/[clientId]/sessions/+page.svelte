<script lang="ts">
    import { batchColors } from "$lib/utils.svelte";
    import type { Session } from "../../../../app";

    let { data } = $props();
    let sessions: Session[] = $state(data.sessions ?? []);
    let header = $state(data.header ?? []);
    console.log("sessions", sessions);
    const navigateSessionDetails = (e: MouseEvent, session: any) => {
        window.location.href = `/clients/${data.client.id}/sessions/${(session as any).id}`;
    };
</script>

<h2 class="text-xl w-full text-center">
    Sitzungs Historie ({sessions.length})
</h2>
<div class="divider mt-1"></div>
{#if sessions.length === 0}
    <div class="alert alert-warning">
        <p>Keine Sitzungen gefunden.</p>
    </div>
{/if}
<div class="overflow-x-auto">
    <table class="table table-zebra">
        <!-- head -->
        <thead>
            <tr>
                <th></th>
                {#if header?.length > 0}
                    <!-- content here -->
                    {#each header as item}
                        <th>{item}</th>

                        <!-- content here -->
                    {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            <!-- row 1 -->
            {#if sessions?.length > 0}
                {#each sessions as session, i}
                    <tr
                        class="item cursor-pointer"
                        onmousedown={(e) => navigateSessionDetails(e, session)}
                    >
                        <th>{sessions.length - i}</th>
                        <td
                            >{new Date(
                                session.session_date,
                            ).toLocaleDateString()}</td
                        >
                        <td>{session.topic}</td>
                        <td>
                            {#each session.keywords as item, i}
                                <div
                                    class="badge {batchColors.find(
                                        (b) => b.type == item.toLowerCase(),
                                    )?.color} mr-2"
                                >
                                    {item}
                                </div>
                            {/each}
                        </td>
                    </tr>
                    <!-- content here -->
                {/each}
                <!-- content here -->
            {/if}
        </tbody>
    </table>
</div>

<style lang="scss">
    .item {
        &:hover {
            background-color: var(--primary) !important;
            color: white !important;
        }
    }
    th {
        font-size: 1rem;
        border-radius: 1rem !important;
    }
</style>
