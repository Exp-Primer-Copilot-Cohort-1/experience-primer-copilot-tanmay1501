function skillsMember () {
  return {
    restrict: 'E',
    scope: {
      member: '=',
      onChange: '&'
    },
    templateUrl: 'app/components/members/member/skillsMember.html',
    controller: SkillsMemberController,
    controllerAs: 'vm',
    bindToController: true
  };
}
    