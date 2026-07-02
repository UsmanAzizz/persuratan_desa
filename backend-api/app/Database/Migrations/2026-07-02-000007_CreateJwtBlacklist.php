<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateJwtBlacklist extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_blacklist' => [
                'type'           => 'INT',
                'auto_increment' => true,
            ],
            'token' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
            ],
            'blacklisted_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id_blacklist', true);
        $this->forge->createTable('jwt_blacklist');
        
        $this->db->query('ALTER TABLE jwt_blacklist MODIFY blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
        // Add partial index manually for optimization since tokens can be long
        $this->db->query('CREATE INDEX idx_jwt_token ON jwt_blacklist (token(255))');
    }

    public function down()
    {
        $this->forge->dropTable('jwt_blacklist');
    }
}
