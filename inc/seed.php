<?php
/** First-run content. Edit everything afterwards in the portal. */
save_data('team', [
    ['id' => 'rene-hornby', 'name' => 'Dr René Hornby', 'role' => 'Audiologist & owner', 'group' => 'audiologist',
     'quals' => 'B.Log IV & M.Communication Path (UP), Rem Dipl (RAU), Doctor of Audiology (A.T. Still University, USA)',
     'hpcsa' => '', 'bio' => '',
     'photo' => '', 'order' => 1, 'visible' => true],
    ['id' => 'lauren-tee', 'name' => 'Lauren Tee', 'role' => 'Audiologist', 'group' => 'audiologist',
     'quals' => '', 'hpcsa' => '', 'bio' => '', 'photo' => '', 'order' => 2, 'visible' => true],
    ['id' => 'rozelle-roets', 'name' => 'Rozelle Roets', 'role' => 'Audiologist', 'group' => 'audiologist',
     'quals' => '', 'hpcsa' => '', 'bio' => '', 'photo' => '', 'order' => 3, 'visible' => true],
    ['id' => 'wanda-vd-walt', 'name' => 'Wanda vd Walt', 'role' => 'Secretary', 'group' => 'support',
     'quals' => '', 'hpcsa' => '', 'bio' => '', 'photo' => '', 'order' => 4, 'visible' => true],
    ['id' => 'jenny-de-jager', 'name' => 'Jenny de Jager', 'role' => 'Secretary / Accounts', 'group' => 'support',
     'quals' => '', 'hpcsa' => '', 'bio' => '', 'photo' => '', 'order' => 5, 'visible' => true],
]);
if (!is_file(data_path('newsletters'))) {
    save_data('newsletters', []);
}
if (!is_file(data_path('images'))) {
    save_data('images', []);
}
if (!is_file(data_path('messages'))) {
    save_data('messages', []);
}
