<script lang="ts">
    import { redirect } from '@sveltejs/kit';

    let { data } = $props();
    let header = $state(data.header ?? []);
    let clients = $state(data.clients ?? []);
    console.log("clients", clients);
    const navigateClientDetails = (e:MouseEvent,client:any) => {
        window.location.href = `/clients/${(client as any).id}`;
    };
    let batchColors = $state([
        {"type": "coaching", "color": "badge-error"},
        {"type": "hypnose", "color": "badge-warning"}
    ]);
</script>

<div class="navbar bg-base-100 shadow-sm w-full">
    <h2 class="mt-2 text-3xl font-bold text-base-content mb-5">
        Klienten ({clients.length})
    </h2>
</div>

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
            {#if clients?.length > 0}
                {#each clients as client, i}
                    <tr class="item cursor-pointer" onmousedown="{(e)=>navigateClientDetails(e,client)}">
                        <th>{clients.length - i}</th>
                        <td>{(client as any).firstname}</td>
                        <td>{(client as any).lastname}</td>
                        <td>{(client as any).email}</td>
                        <td>{(client as any).phone}</td>
                        <td>
                            {#each (client as any).type as item, i}
                                <div class="badge {batchColors.find(b=>b.type==item.toLowerCase())?.color} mr-2">{item}</div>
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
        font-size:1rem ;
        border-radius: 1rem !important;
    }
</style>
