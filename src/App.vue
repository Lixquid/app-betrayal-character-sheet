<template lang="pug">
    .container.my-5.mx-auto
        h1
            | Betrayal Character Sheet
            |
            .float-right
                button.btn.btn-outline-danger.mr-3(
                    v-on:click.passive="fullReset"
                    title="Full Reset"
                ) &#x267B;
                a.btn.btn-outline-primary(href="https://lixquid.com").
                    lixquid.com
        .card.mt-5
            .card-header.transition-background(
                :style="{background: characterColor}"
            )
                select.custom-select(v-model.number="character.character")
                    option(
                        v-for="(char, i) in allCharacterData"
                        :key="i"
                        :value="i"
                    ) {{char.name}}
            .card-body
                label.w-100
                    | Speed
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="character.speed"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.speed"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialSpeed}`
                            v-on:click.passive="character.speed = i"
                        ) {{v}}
                label.w-100
                    | Might
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="character.might"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.might"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialMight}`
                            v-on:click.passive="character.might = i"
                        ) {{v}}
                label.w-100
                    | Sanity
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="character.sanity"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.sanity"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialSanity}`
                            v-on:click.passive="character.sanity = i"
                        ) {{v}}
                label.w-100
                    | Knowledge
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="character.knowledge"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.knowledge"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialKnowledge}`
                            v-on:click.passive="character.knowledge = i"
                        ) {{v}}
        .card.mt-3
            .card-header
                | Action Log
                .float-right
                    a.text-secondary.mr-3(
                        href="#"
                        v-on:click.prevent="actionLog.oldestFirst = !actionLog.oldestFirst"
                    ) {{actionLog.oldestFirst ? "Descending" : "Ascending"}}
                    a.text-danger(
                        href="#"
                        v-on:click.prevent="actionLog.log = []"
                    ) Clear All
            .card-body
                ul
                    li(v-for="(entry, i) in sortedLog" :key="i") {{entry}}
</template>

<script lang="ts">
import Vue from "vue";
import { createComponent, ref, computed, watch } from "@vue/composition-api";
import allCharacterData from "./characters.json";
import { useLocalStorageRef, dualbounce } from "./vueUtilities";

const characterColorMap = {
    red: "#e85752",
    yellow: "#fff299",
    green: "#b1d28f",
    blue: "#6193cf",
    purple: "#c173b0",
    white: "#d3d7cf"
};

export default createComponent({
    setup() {
        const character = useLocalStorageRef("character", {
            character: 0,
            speed: 0,
            might: 0,
            sanity: 0,
            knowledge: 0
        });
        const actionLog = useLocalStorageRef("actionLog", {
            log: [] as string[],
            oldestFirst: true
        });

        function addWatch<T>(
            val: () => T,
            str: (n: T, o: T) => string | undefined
        ): void {
            watch(
                val,
                dualbounce((n, o) => {
                    if (n === o) return;
                    actionLog.value.log.push(
                        `[${new Date().toLocaleString()}]: ${str(n, o)}`
                    );
                }, 1000),
                { lazy: true }
            );
        }

        addWatch(
            () => character.value.character,
            (n, o) =>
                `Change character from ${allCharacterData[o].name} to ${allCharacterData[n].name}`
        );

        const characterData = computed(
            () => allCharacterData[character.value.character]
        );

        addWatch(
            () => character.value.speed,
            (n, o) =>
                `${n > o ? "Increase" : "Decrease"} speed from ${
                    characterData.value.speed[o]
                } (step ${o + 1}) to ${characterData.value.speed[n]} (step ${n +
                    1})`
        );
        addWatch(
            () => character.value.might,
            (n, o) =>
                `${n > o ? "Increase" : "Decrease"} might from ${
                    characterData.value.might[o]
                } (step ${o + 1}) to ${characterData.value.might[n]} (step ${n +
                    1})`
        );
        addWatch(
            () => character.value.sanity,
            (n, o) =>
                `${n > o ? "Increase" : "Decrease"} sanity from ${
                    characterData.value.sanity[o]
                } (step ${o + 1}) to ${
                    characterData.value.sanity[n]
                } (step ${n + 1})`
        );
        addWatch(
            () => character.value.knowledge,
            (n, o) =>
                `${n > o ? "Increase" : "Decrease"} knowledge from ${
                    characterData.value.knowledge[o]
                } (step ${o + 1}) to ${
                    characterData.value.knowledge[n]
                } (step ${n + 1})`
        );

        const characterColor = computed(
            () =>
                characterColorMap[
                    characterData.value.color as keyof typeof characterColorMap
                ]
        );
        const sortedLog = computed(() =>
            actionLog.value.oldestFirst
                ? actionLog.value.log
                : actionLog.value.log.slice().reverse()
        );

        function fullReset(): void {
            if (
                !confirm(
                    "This will wipe all local settings, restoring the app from a completely clean slate. This cannot be undone. Are you sure you want to do this?"
                )
            )
                return;
            localStorage.clear();
            window.location.reload();
        }

        return {
            character,
            actionLog,
            sortedLog,

            characterData,
            characterColor,
            allCharacterData,

            fullReset
        };
    }
});
</script>

<style lang="stylus" scoped>
.transition-background
    transition background .3s
</style>
