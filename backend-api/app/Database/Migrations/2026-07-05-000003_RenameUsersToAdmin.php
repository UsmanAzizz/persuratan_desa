<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class RenameUsersToAdmin extends Migration
{
    public function up()
    {
        // 1. Drop foreign key in riwayat_status (since it references users)
        $this->forge->dropForeignKey('riwayat_status', 'riwayat_status_id_user_eksekutor_foreign');
        
        // 2. Rename the table
        $this->forge->renameTable('users', 'admin');

        // 3. Re-add foreign key referencing admin
        $this->forge->addForeignKey('id_user_eksekutor', 'admin', 'id_user', 'SET NULL', 'CASCADE');
        $this->forge->processIndexes('riwayat_status');
    }

    public function down()
    {
        // Drop new foreign key
        $this->forge->dropForeignKey('riwayat_status', 'riwayat_status_id_user_eksekutor_foreign');
        
        // Rename back to users
        $this->forge->renameTable('admin', 'users');

        // Re-add old foreign key
        $this->forge->addForeignKey('id_user_eksekutor', 'users', 'id_user', 'SET NULL', 'CASCADE');
        $this->forge->processIndexes('riwayat_status');
    }
}
