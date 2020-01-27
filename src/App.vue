<template lang="pug">
    .container.my-5.mx-auto
        h1
            | Betrayal Character Sheet
            |
            a.btn.btn-outline-primary.float-right(href="https://lixquid.com").
                lixquid.com
        .card.mt-5
            .card-header.transition-background(
                :style="{background: characterColor}"
            )
                select.custom-select(v-model.number="character")
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
                        v-model.number="speed"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.speed"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialSpeed}`
                            v-on:click.passive="speed = i"
                        ) {{v}}
                label.w-100
                    | Might
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="might"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.might"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialMight}`
                            v-on:click.passive="might = i"
                        ) {{v}}
                label.w-100
                    | Sanity
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="sanity"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.sanity"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialSanity}`
                            v-on:click.passive="sanity = i"
                        ) {{v}}
                label.w-100
                    | Knowledge
                    input.custom-range(
                        type="range"
                        min="0"
                        max="7"
                        v-model.number="knowledge"
                    )
                    .d-flex.justify-content-between
                        span.h4(
                            v-for="(v, i) in characterData.knowledge"
                            :key="i"
                            :class=`{'text-primary': i === characterData.initialKnowledge}`
                            v-on:click.passive="knowledge = i"
                        ) {{v}}
        .card.mt-3
            .card-header Action Log
            .card-body
                ul
                    li(v-for="(entry, i) in actionLog" :key="i") {{entry}}
</template>

<script lang="ts">
import Vue from "vue";
import { createComponent, ref, computed, watch } from "@vue/composition-api";
import allCharacterData from "./characters.json";

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
        const character = ref(0);
        const actionLog = ref<string[]>([]);
        const speed = ref(0);
        const might = ref(0);
        const sanity = ref(0);
        const knowledge = ref(0);

        function addAction(entry: string): void {
            actionLog.value.push(`[${new Date().toLocaleString()}]: ${entry}`);
        }

        watch(
            character,
            (newV, oldV) =>
                addAction(
                    "Change character from " +
                        allCharacterData[oldV].name +
                        " to " +
                        allCharacterData[newV].name
                ),
            { lazy: true }
        );

        const characterData = computed(() => allCharacterData[character.value]);

        watch(
            speed,
            (newV, oldV) =>
                addAction(
                    `${newV > oldV ? "Increase" : "Decrease"} speed from ${
                        characterData.value.speed[oldV]
                    } (step ${oldV + 1}) to ${
                        characterData.value.speed[newV]
                    } (step ${newV + 1})`
                ),
            { lazy: true }
        );
        watch(
            might,
            (newV, oldV) =>
                addAction(
                    `${newV > oldV ? "Increase" : "Decrease"} might from ${
                        characterData.value.might[oldV]
                    } (step ${oldV + 1}) to ${
                        characterData.value.might[newV]
                    } (step ${newV + 1})`
                ),
            { lazy: true }
        );
        watch(
            sanity,
            (newV, oldV) =>
                addAction(
                    `${newV > oldV ? "Increase" : "Decrease"} sanity from ${
                        characterData.value.sanity[oldV]
                    } (step ${oldV + 1}) to ${
                        characterData.value.sanity[newV]
                    } (step ${newV + 1})`
                ),
            { lazy: true }
        );
        watch(
            knowledge,
            (newV, oldV) =>
                addAction(
                    `${newV > oldV ? "Increase" : "Decrease"} knowledge from ${
                        characterData.value.knowledge[oldV]
                    } (step ${oldV + 1}) to ${
                        characterData.value.knowledge[newV]
                    } (step ${newV + 1})`
                ),
            { lazy: true }
        );

        const characterColor = computed(
            () =>
                characterColorMap[
                    characterData.value.color as keyof typeof characterColorMap
                ]
        );

        return {
            character,
            actionLog,
            characterData,
            characterColor,
            allCharacterData,
            speed,
            might,
            sanity,
            knowledge
        };
    }
});
</script>

<style lang="stylus" scoped>
.transition-background
    transition background .3s
</style>
