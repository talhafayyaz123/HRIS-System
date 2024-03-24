<script setup>
const props = defineProps({
    matrixGroups: {
        type: Object,
        default: {}
    },
    matrixTeams: {
        type: Object,
        default: {}
    },

}),
    findSkillLevel = (skills, skillId) => {
        if (skills) {
            for (const skillGroup of skills) {
                for (const subSkill of skillGroup) {
                    if (subSkill.skillId === skillId) {
                        return subSkill.skillLevel;
                    }
                }
            }
        }
        return null;
    }
</script>

<template>
    <div class="matrix p-4">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th class="w-16"></th>
                    <th class="w-64 border-right"></th>
                    <th v-for="(group, key) in matrixGroups" class="border-right border-bottom"
                        :colspan="group?.skills?.length">
                        {{ group?.name }}
                        <table v-if="group.isGroup">
                            <tr>
                                <th v-for="skill in group?.skills" class="rotate-cur">
                                    <div>
                                        <span>{{ skill.name }}</span>
                                    </div>
                                </th>
                            </tr>
                        </table>
                        <table v-else>
                            <tr>
                                <th class="rotate-cur">
                                    <div>
                                        <span>{{ group?.skillName }}</span>
                                    </div>
                                </th>
                            </tr>
                        </table>
                    </th>
                </tr>
            </thead>
            <tbody v-for="(team, index) in matrixTeams" :key="index">
            <tr v-if="team.isTeam && team.teamMembers.length > 0" class="border-bottom border-top">
                <td class="team-mem " :class="{'team-width' : (team.teamMembers.length === 1)}"  :title="team.name"><strong>{{ team.name }}</strong></td>
            </tr>
            <tr v-if="team.isTeam && team.teamMembers.length > 0"  v-for="user in team?.teamMembers" class="">
                <td :title="team.name"></td>
                <td class="border-left border-right border-bottom border-top">
                    <div class="member">
                        <img src="~/assets/images/user.png" alt="">
                        {{ user.name }}
                    </div>
                </td>
                <td v-for="group in matrixGroups" :colspan="group?.skills?.length" class="border-bottom border-right border-top">
                    <table>
                        <tr>
                            <td v-if="group.isGroup" v-for="skill in group?.skills">
                                <div v-if="user?.skills?.length > 0" class="main_cir">
                                    <img v-if="findSkillLevel(user.skills, skill.id) == 1" src="~/assets/images/matrix/matrix1.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, skill.id) == 2" src="~/assets/images/matrix/matrix2.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, skill.id) == 3" src="~/assets/images/matrix/matrix3.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, skill.id) == 4" src="~/assets/images/matrix/matrix4.png" alt="">
                                    <!--                                        <img v-if="!findSkillLevel(user.skills, skill)" src="../../../assets/images/matrix/matrix.png" alt="">-->
                                    <div class="select_cir" v-if="!findSkillLevel(user.skills, skill.id)">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                                <div v-else class="main_cir">
                                    <div class="select_cir">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                            </td>
                            <td v-else>
                                <div  class="main_cir">
                                    <img v-if="findSkillLevel(user.skills, group.id) == 1" src="~/assets/images/matrix/matrix1.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, group.id) == 2" src="~/assets/images/matrix/matrix2.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, group.id) == 3" src="~/assets/images/matrix/matrix3.png" alt="">
                                    <img v-if="findSkillLevel(user.skills, group.id) == 4" src="~/assets/images/matrix/matrix4.png" alt="">
                                    <div class="select_cir" v-if="!findSkillLevel(user.skills, group.id)">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr v-if="!team.isTeam">
                <td class="border-left border-right border-bottom border-top" colspan="2">
                    <div class="member ml-auto">
                        <img src="~/assets/images/user.png" alt="">
                        {{ team.employee }}
                    </div>
                </td>
                <td v-for="group in matrixGroups" :colspan="group?.skills?.length" class="border-bottom border-right border-top" >
                    <table>
                        <tr>
                            <td v-if="group.isGroup" v-for="skill in group?.skills">
                                <div v-if="team?.skills?.length > 0" class="main_cir">
                                    <img v-if="findSkillLevel(team.skills, skill.id) == 1" src="~/assets/images/matrix/matrix1.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, skill.id) == 2" src="~/assets/images/matrix/matrix2.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, skill.id) == 3" src="~/assets/images/matrix/matrix3.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, skill.id) == 4" src="~/assets/images/matrix/matrix4.png" alt="">
                                    <!--                                        <img v-if="!findSkillLevel(user.skills, skill)" src="../../../assets/images/matrix/matrix.png" alt="">-->
                                    <div class="select_cir" v-if="!findSkillLevel(team.skills, skill.id)">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                                <div v-else class="main_cir">
                                    <div class="select_cir">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                            </td>
                            <td v-else>
                                <div  class="main_cir">
                                    <img v-if="findSkillLevel(team.skills, group.id) == 1" src="~/assets/images/matrix/matrix1.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, group.id) == 2" src="~/assets/images/matrix/matrix2.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, group.id) == 3" src="~/assets/images/matrix/matrix3.png" alt="">
                                    <img v-if="findSkillLevel(team.skills, group.id) == 4" src="~/assets/images/matrix/matrix4.png" alt="">
                                    <div class="select_cir" v-if="!findSkillLevel(team.skills, group.id)">
                                        <div class="cir_1 cir"></div>
                                        <div class="cir_2 cir"></div>
                                        <div class="cir_3 cir"></div>
                                        <div class="cir_4 cir"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
